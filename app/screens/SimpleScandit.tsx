import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AppState,
  AppStateStatus,
  BackHandler,
  PermissionsAndroid,
  Platform,
  Pressable,
  SafeAreaView
} from 'react-native';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { useBackHandler } from '@react-native-community/hooks';
import {
  BarcodeCapture,
  BarcodeCaptureOverlay,
  BarcodeCaptureOverlayStyle,
  BarcodeCaptureSession,
  BarcodeCaptureSettings,
  Symbology,
  SymbologyDescription
} from 'scandit-react-native-datacapture-barcode';
import {
  Camera,
  CameraSettings,
  DataCaptureContext,
  DataCaptureView,
  FrameSourceState,
  RectangularViewfinder,
  RectangularViewfinderStyle,
  RectangularViewfinderLineStyle,
  TorchState,
  VideoResolution
} from 'scandit-react-native-datacapture-core';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScanditStore } from '@app/stores';
import { sleep } from '@app/utils';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { ScanditStore, StackParamsList } from '@app/types';

const { EXPO_PUBLIC_AMS_365_SCANDIT_LICENSE_KEY, EXPO_PUBLIC_AMS_MOBILE_SCANDIT_LICENSE_KEY, EXPO_PUBLIC_MOBILE_ENV } =
  process.env;
const isAndroidMarshmallowOrNewer = Platform.OS === 'android' && Platform.Version >= 23;

const checkCameraPermissions = async () => {
  if (isAndroidMarshmallowOrNewer) {
    return await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
  } else {
    return true;
  }
};

const requestCameraPermissions = async () => {
  if (isAndroidMarshmallowOrNewer) {
    try {
      const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // console.log("Android Camera Permission has been granted.");
        return Promise.resolve();
      } else {
        // console.log("Android Camera Permission has been denied.");
        return Promise.reject();
      }
    } catch (err) {
      return Promise.reject(err);
    }
  } else {
    return Promise.resolve();
  }
};

const requestCameraPermissionsIfNeeded = async () => {
  const hasPermissions = await checkCameraPermissions();
  if (!hasPermissions) {
    return requestCameraPermissions();
  } else {
    return Promise.resolve();
  }
};

export default function SimpleScandit(): ReactComponent {
  //===========================================================================
  //================================ variables ================================
  //===========================================================================
  const refView = useRef<DataCaptureView>(null);
  // Due to a React Native issue with firing the AppState 'change' event on iOS, we want to avoid triggering
  // a startCapture/stopCapture on the scanner twice in a row. We work around this by keeping track of the
  // latest command that was run, and skipping a repeated call for starting or stopping scanning.
  const refLastCommand = useRef<'startCapture' | 'turnTorchOff' | 'stopCapture' | null>(null);
  const refIsExitingScreen = useRef<boolean>(false);
  const refIsPermissionsEnabled = useRef<boolean>(false);
  const refCamera = useRef<Camera | null>(null);
  const refBarcodeCaptureMode = useRef<BarcodeCapture | null>(null);
  const isFocused = useIsFocused();
  const navigation: any = useNavigation<StackNavigationProp<StackParamsList>>();
  const {
    isTorchOn: isGlobalTorchOn,
    setIsTorchOn: setGlobalTorchOn,
    simpleScanditResults,
    setSimpleScanditResults
  } = useScanditStore((store: ScanditStore) => store);
  const dataCaptureContext = useMemo(() => {
    // Enter your Scandit License key here.
    // Your Scandit License key is available via your Scandit SDK web account.
    return DataCaptureContext.forLicenseKey(
      EXPO_PUBLIC_MOBILE_ENV === 'prod' && Platform.OS === 'android'
        ? EXPO_PUBLIC_AMS_365_SCANDIT_LICENSE_KEY
        : EXPO_PUBLIC_AMS_MOBILE_SCANDIT_LICENSE_KEY
    );
  }, []);
  const [isCameraTorchAvailable, setIsCameraTorchAvailable] = useState<boolean | null>(null);
  const [isTorchOn, setIsTorchOn] = useState(isGlobalTorchOn);
  const [appStateVisible, setAppStateVisible] = useState(AppState.currentState);
  const [isCaptureStateRunning, setIsCaptureStateRunning] = useState(false);

  //===========================================================================
  //================================ functions ================================
  //===========================================================================
  const handleGoBack = async () => {
    if (refIsExitingScreen.current) {
      await sleep(100); // react state recursion from allowing torch to turn off first
    } else {
      refIsExitingScreen.current = true;
    }
    if (isTorchOn) {
      if (!isGlobalTorchOn) {
        // local torch is on, but global torch is off
        setGlobalTorchOn(true);
      }
      refLastCommand.current = 'turnTorchOff';
      toggleTorch();
    } else if (isGlobalTorchOn && refLastCommand.current !== 'turnTorchOff') {
      // local torch is off, but global torch is on
      setGlobalTorchOn(false);
      await stopCapture();
    } else {
      await stopCapture();
    }
  };
  //---------------------------------------------------------------------------
  const setupScanning = async () => {
    try {
      // first, check to see if the app has camera permissions.
      const hasCameraPermissions = await checkCameraPermissions();
      if (hasCameraPermissions) {
        refIsPermissionsEnabled.current = true;
      } else {
        await requestCameraPermissionsIfNeeded();
        refIsPermissionsEnabled.current = true;
      }
      // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
      // default and must be turned on to start streaming frames to the data capture context for recognition.
      const cameraSettings = new CameraSettings();
      cameraSettings.preferredResolution = VideoResolution.FullHD;
      refCamera.current = Camera.withSettings(cameraSettings);
      await dataCaptureContext.setFrameSource(refCamera.current);
      // The barcode capturing process is configured through barcode capture settings
      // and are then applied to the barcode capture instance that manages barcode recognition.
      const settings = new BarcodeCaptureSettings();
      // The settings instance initially has all types of barcodes (symbologies) disabled. For the purpose of this
      // sample we enable a very generous set of symbologies. In your own app ensure that you only enable the
      // symbologies that your app requires as every additional enabled symbology has an impact on processing times.
      settings.enableSymbologies([
        Symbology.EAN13UPCA,
        Symbology.EAN8,
        Symbology.UPCE,
        Symbology.QR,
        Symbology.DataMatrix,
        Symbology.Code39,
        Symbology.Code128,
        Symbology.InterleavedTwoOfFive
      ]);
      // Some linear/1d barcode symbologies allow you to encode variable-length data. By default, the Scandit
      // Data Capture SDK only scans barcodes in a certain length range. If your application requires scanning of one
      // of these symbologies, and the length is falling outside the default range, you may need to adjust the "active
      // symbol counts" for this symbology. This is shown in the following few lines of code for one of the
      // variable-length symbologies.
      const symbologySettings = settings.settingsForSymbology(Symbology.Code39);
      symbologySettings.activeSymbolCounts = [7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
      // Create new barcode capture mode with the settings from above.
      const barcodeCapture = BarcodeCapture.forContext(dataCaptureContext, settings);
      // By default, every time a barcode is scanned, a sound (if not in silent mode) and a vibration are played.
      // Uncomment the following lines to set a success feedback without sound and vibration.
      // const feedback = BarcodeCaptureFeedback.default;
      // feedback.success = new Feedback(null, null);
      // barcodeCapture.feedback = feedback;
      // Uncomment the following line to set a success feedback without sound and vibration.
      // const defaultFeedback = Feedback.defaultFeedback;

      // Register a listener to get informed whenever a new barcode got recognized.
      const barcodeCaptureListener = {
        didScan: async (_: BarcodeCapture, session: BarcodeCaptureSession) => {
          const barcode = session.newlyRecognizedBarcode;
          if (barcode == null) return;
          const symbology = new SymbologyDescription(barcode.symbology);
          // The `alert` call blocks execution until it's dismissed by the user. As no further frames would be processed
          // until the alert dialog is dismissed, we're showing the alert through a timeout and disabling the barcode
          // capture mode until the dialog is dismissed, as you should not block the BarcodeCaptureListener callbacks for
          // longer periods of time. See the documentation to learn more about this.
          if (refBarcodeCaptureMode.current) refBarcodeCaptureMode.current.isEnabled = false;
          // We also want to emit a feedback (vibration and, if enabled, sound).
          // By default, every time a barcode is scanned, a sound (if not in silent mode) and a vibration are played.
          // To emit a feedback only when necessary, it is necessary to set a success feedback without sound and
          // vibration when setting up Barcode Capture (in this case in the `setupScanning`).
          // defaultFeedback.emit();
          setSimpleScanditResults(`${barcode.data}`);
        }
      };
      // Add the listener to the barcode capture context.
      barcodeCapture.addListener(barcodeCaptureListener);
      // Add a barcode capture overlay to the data capture view to render the location of captured barcodes on top of
      // the video preview, using the Frame overlay style. This is optional, but recommended for better visual feedback.
      const overlay = BarcodeCaptureOverlay.withBarcodeCaptureForViewWithStyle(
        barcodeCapture,
        null,
        BarcodeCaptureOverlayStyle.Frame
      );
      overlay.viewfinder = new RectangularViewfinder(
        RectangularViewfinderStyle.Square,
        RectangularViewfinderLineStyle.Light
      );
      refView.current?.addOverlay(overlay);
      refBarcodeCaptureMode.current = barcodeCapture;
      await startCapture();
    } catch (error: any) {
      if (!isFocused) return;
      await handleGoBack();
    }
  };
  //---------------------------------------------------------------------------
  const startCapture = async () => {
    if (refLastCommand.current === 'startCapture') {
      return;
    }
    refLastCommand.current = 'startCapture';
    await startCamera();
    if (refBarcodeCaptureMode.current) refBarcodeCaptureMode.current.isEnabled = true;
    setIsCaptureStateRunning(true);
  };
  //---------------------------------------------------------------------------
  const stopCapture = async () => {
    if (refLastCommand.current === 'stopCapture') {
      return;
    }
    refLastCommand.current = 'stopCapture';
    if (refBarcodeCaptureMode.current) refBarcodeCaptureMode.current.isEnabled = false;
    await stopCamera();
    setIsCaptureStateRunning(false);
  };
  //---------------------------------------------------------------------------
  const startCamera = async () => {
    try {
      if (!refCamera.current) return;
      // Switch camera on to start streaming frames and enable the barcode capture mode.
      refCamera.current.switchToDesiredState(FrameSourceState.On);
      await sleep(200); // The camera is started asynchronously and will take some time to completely turn on.
    } catch (error: any) {
      BackHandler.exitApp();
    }
  };
  //---------------------------------------------------------------------------
  const stopCamera = async () => {
    if (!refCamera.current) return;
    refCamera.current.switchToDesiredState(FrameSourceState.Off);
    await sleep(100); // ensure camera completes turning off before continuing...
  };
  //---------------------------------------------------------------------------
  const setupTorchButton = async (): Promise<void> => {
    try {
      if (!refCamera.current) return;
      const isTorchAvailable = await refCamera.current.getIsTorchAvailable();
      setIsCameraTorchAvailable(isTorchAvailable);
    } catch (error: any) {
      setIsCameraTorchAvailable(false);
    }
  };
  //---------------------------------------------------------------------------
  const toggleTorch = () => {
    if (!refCamera.current) return;
    refCamera.current.desiredTorchState = isTorchOn ? TorchState.Off : TorchState.On;
    setIsTorchOn(!isTorchOn); // triggers useEffect
  };
  //---------------------------------------------------------------------------
  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    setAppStateVisible(nextAppState);
  };

  //===========================================================================
  //================================== setup ==================================
  //===========================================================================
  useBackHandler(() => {
    // handles back button for android
    if (isFocused) {
      // change default back behavior
      handleGoBack();
      return true;
    }
    // let the default thing happen
    return false;
  }, [isFocused]);
  //---------------------------------------------------------------------------
  useEffect(() => {
    const handleAppStateChangeSubscription = AppState.addEventListener('change', handleAppStateChange);
    setupScanning();
    return () => {
      handleAppStateChangeSubscription.remove();
      if (refLastCommand.current === 'startCapture') {
        stopCapture();
        dataCaptureContext.dispose();
      }
      if (refCamera.current) {
        refCamera.current.switchToDesiredState(FrameSourceState.Off);
      }
    };
  }, []);
  //---------------------------------------------------------------------------
  useEffect(() => {
    // freeze capture mode if app is minimized
    if (appStateVisible.match(/inactive|background/)) {
      stopCapture();
    } else if (refIsPermissionsEnabled.current) {
      startCapture();
    }
  }, [appStateVisible]);
  //---------------------------------------------------------------------------
  useEffect(() => {
    if (!isFocused || !simpleScanditResults || !refLastCommand.current) return;
    // captured scan results
    if (!!simpleScanditResults) handleGoBack();
  }, [simpleScanditResults]);
  //---------------------------------------------------------------------------
  useEffect(() => {
    if (!isFocused || (!isCaptureStateRunning && !refIsExitingScreen.current)) return;
    if (isCaptureStateRunning && isCameraTorchAvailable === null) {
      // after camera and capture are on, add the torch button if it's available
      setupTorchButton();
    } else if (!isCaptureStateRunning && navigation.canGoBack()) {
      // allows all necissary cleanup to happen before going back to the previous screen
      navigation.goBack();
    }
  }, [isCaptureStateRunning]);
  //---------------------------------------------------------------------------
  useEffect(() => {
    if (!isFocused || !refIsExitingScreen.current) return;
    handleGoBack();
  }, [isTorchOn]);

  //===========================================================================
  //================================== render =================================
  //===========================================================================
  return (
    <>
      {isCaptureStateRunning ? (
        <SafeAreaView
          style={{
            position: 'absolute',
            top: 30,
            left: 20,
            borderWidth: 1,
            borderColor: '#ffffff',
            borderRadius: 8,
            zIndex: 10
          }}
        >
          <Pressable
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: 'transparent'
            }}
            onPress={handleGoBack}
          >
            <MaterialCommunityIcons name="keyboard-backspace" size={32} color="#ffffff" />
          </Pressable>
        </SafeAreaView>
      ) : null}
      <DataCaptureView style={{ flex: 1 }} context={dataCaptureContext} ref={refView} />
      {isCameraTorchAvailable ? (
        <SafeAreaView
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            borderWidth: 1,
            borderColor: '#ffffff',
            borderRadius: 8,
            backgroundColor: isTorchOn ? '#ffffff' : 'rgba(0, 0, 0, 0.7)',
            zIndex: 10
          }}
        >
          <Pressable
            style={{
              flex: 1,
              paddingHorizontal: 16,
              paddingVertical: 8,
              backgroundColor: 'transparent'
            }}
            onPress={toggleTorch}
          >
            <MaterialCommunityIcons
              name={isTorchOn ? 'flashlight' : 'flashlight-off'}
              size={16}
              color={isTorchOn ? '#000000' : '#ffffff'}
            />
          </Pressable>
        </SafeAreaView>
      ) : null}
    </>
  );
}
