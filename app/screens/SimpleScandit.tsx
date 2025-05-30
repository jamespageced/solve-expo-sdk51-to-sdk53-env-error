import React, { useCallback, useMemo, useRef, useState } from 'react';
import { BackHandler, Platform, Pressable } from 'react-native';
import { AMS_365_SCANDIT_LICENSE_KEY, AMS_MOBILE_SCANDIT_LICENSE_KEY, MOBILE_ENV } from '@env';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  BarcodeCapture,
  BarcodeCaptureListener,
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
  FrameData,
  RectangularViewfinder,
  RectangularViewfinderStyle,
  RectangularViewfinderLineStyle,
  VideoResolution,
  TorchState
} from 'scandit-react-native-datacapture-core';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useScanditStore } from '@app/stores';
import { requestCameraPermissionsIfNeeded } from '@app/utils';
import type { ScanditStore, StackParamsList } from '@app/types';

export default function SimpleScandit() {
  //================================ variables ================================
  const navigation: any = useNavigation<StackNavigationProp<StackParamsList>>();
  const viewRef = useRef<DataCaptureView>(null);
  const camera = useRef<Camera | null>(null);
  const barcodeCaptureMode = useRef<BarcodeCapture | null>(null);
  // Due to a React Native issue with firing the AppState 'change' event on iOS, we want to avoid triggering
  // a startCapture/stopCapture on the scanner twice in a row. We work around this by keeping track of the
  // latest command that was run, and skipping a repeated call for starting or stopping scanning.
  const setupFlagRef = useRef(false);
  const lastCommand = useRef<string | null>(null);
  const { simpleScanditResults, setSimpleScanditResults } = useScanditStore((store: ScanditStore) => store);
  const [isCameraTorchAvailable, setIsCameraTorchAvailable] = useState(false);
  const [isTorchOn, setIsTorchOn] = useState(false);
  const [localScanResults, setLocalScanResults] = useState('');
  const dataCaptureContext = useMemo(() => {
    // Enter your Scandit License key here.
    // Your Scandit License key is available via your Scandit SDK web account.
    return DataCaptureContext.forLicenseKey(
      MOBILE_ENV === 'prod' && Platform.OS === 'android' ? AMS_365_SCANDIT_LICENSE_KEY : AMS_MOBILE_SCANDIT_LICENSE_KEY
    );
  }, []);

  //================================ functions ================================
  const setupScanning = () => {
    // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
    // default and must be turned on to start streaming frames to the data capture context for recognition.
    const cameraSettings = new CameraSettings();
    cameraSettings.preferredResolution = VideoResolution.FullHD;

    const cameraInstance = Camera.withSettings(cameraSettings);
    dataCaptureContext.setFrameSource(cameraInstance);
    camera.current = cameraInstance;

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
    const barcodeCaptureListener: BarcodeCaptureListener = {
      didScan: async (
        barcodeCapture: BarcodeCapture,
        session: BarcodeCaptureSession,
        _getFrameData: () => Promise<FrameData>
      ) => {
        const barcode = session.newlyRecognizedBarcode;
        if (barcode == null) return;

        const symbology = new SymbologyDescription(barcode.symbology);

        // The `alert` call blocks execution until it's dismissed by the user. As no further frames would be processed
        // until the alert dialog is dismissed, we're showing the alert through a timeout and disabling the barcode
        // capture mode until the dialog is dismissed, as you should not block the BarcodeCaptureListener callbacks for
        // longer periods of time. See the documentation to learn more about this.
        barcodeCapture.isEnabled = false;

        // Use the following code to reject barcodes.
        // By uncommenting the following lines, barcodes not starting with 09: are ignored.
        // if (!barcode.data?.startsWith('09:')) {
        //    // We temporarily change the brush, used to highlight recognized barcodes, to a transparent brush.
        //   overlay.brush = Brush.transparent;
        //   return;
        // }
        // Otherwise, if the barcode is of interest, we want to use a brush to highlight it.
        // overlay.brush = new Brush(
        //   Color.fromHex('FFF0'),
        //   Color.fromHex('FFFF'),
        //   3
        // );

        // We also want to emit a feedback (vibration and, if enabled, sound).
        // By default, every time a barcode is scanned, a sound (if not in silent mode) and a vibration are played.
        // To emit a feedback only when necessary, it is necessary to set a success feedback without sound and
        // vibration when setting up Barcode Capture (in this case in the `setupScanning`).
        // defaultFeedback.emit();
        setLocalScanResults(`${barcode.data}`);
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
    viewRef.current?.addOverlay(overlay);
    barcodeCaptureMode.current = barcodeCapture;
  };
  //---------------------------------------------------------------------------
  const setupCameraBottomButtons = async (): Promise<void> => {
    if (!camera.current) return;
    const isTorchAvailable = await camera.current.getIsTorchAvailable();
    setIsCameraTorchAvailable(isTorchAvailable);
  };
  //---------------------------------------------------------------------------
  const startCapture = async () => {
    console.log('begin startCapture()');
    if (lastCommand.current === 'startCapture') {
      return;
    }
    lastCommand.current = 'startCapture';
    await startCamera();
    if (barcodeCaptureMode.current) {
      barcodeCaptureMode.current.isEnabled = true;
    }
    console.log('end startCapture()');
  };
  //---------------------------------------------------------------------------
  const stopCapture = async () => {
    console.log('begin stopCapture()');
    if (lastCommand.current === 'stopCapture') {
      return;
    }
    lastCommand.current = 'stopCapture';
    if (barcodeCaptureMode.current) {
      barcodeCaptureMode.current.isEnabled = false;
    }
    await stopCamera();
    console.log('end stopCapture()');
  };
  //---------------------------------------------------------------------------
  const startCamera = async () => {
    console.log('begin startCamera()');
    try {
      // Switch camera on to start streaming frames and enable the barcode capture mode.
      // The camera is started asynchronously and will take some time to completely turn on.
      await requestCameraPermissionsIfNeeded();
      if (camera.current) {
        await camera.current.switchToDesiredState(FrameSourceState.On);
        const cameraCurrentState = await camera.current.getCurrentState();
        if (cameraCurrentState === FrameSourceState.On) {
          // checks what options the camera has and sets up the buttons
          await setupCameraBottomButtons();
        }
      }
      console.log('end startCamera()');
    } catch (error: any) {
      BackHandler.exitApp();
    }
  };
  //---------------------------------------------------------------------------
  const stopCamera = async () => {
    console.log('begin stopCamera()');
    try {
      if (camera.current) {
        // turn off camera torch state if it's on
        if (isCameraTorchAvailable && camera.current.desiredTorchState !== TorchState.Off) {
          camera.current.desiredTorchState = TorchState.Off;
        }
        // then, turn off camera
        await camera.current.switchToDesiredState(FrameSourceState.Off);
        const cameraCurrentState = await camera.current.getCurrentState();
        // then, go back to previous screen
        console.log('cameraCurrentState:', cameraCurrentState);
      }
      console.log('end stopCamera()');
    } catch (error: any) {
      BackHandler.exitApp();
    }
  };
  //---------------------------------------------------------------------------
  const toggleTorch = () => {
    if (!camera.current) return;
    camera.current.desiredTorchState = isTorchOn ? TorchState.Off : TorchState.On;
    setIsTorchOn(!isTorchOn);
  };
  //---------------------------------------------------------------------------
  const initSetup = useCallback(async () => {
    if (!setupFlagRef.current) {
      setupScanning();
      await startCapture();
      setupFlagRef.current = true;
    }
  }, []);

  //================================== setup ==================================
  useFocusEffect(
    useCallback(() => {
      if (!!simpleScanditResults) {
        navigation.goBack();
        return;
      }
      initSetup();
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
        navigation.goBack();
        return true;
      });
      return async () => {
        backHandler.remove();
        await stopCapture();
        dataCaptureContext.removeAllModes();
      };
    }, [simpleScanditResults])
  );
  useFocusEffect(
    useCallback(() => {
      if (!!localScanResults) setSimpleScanditResults(localScanResults);
    }, [localScanResults])
  );

  //================================== render =================================
  return (
    <>
      <Pressable
        style={{
          position: 'absolute',
          top: 30,
          left: 0,
          paddingHorizontal: 16,
          paddingVertical: 8,
          zIndex: 10
        }}
        onPress={() => navigation.goBack()}
      >
        <MaterialCommunityIcons name="keyboard-backspace" size={24} color="#ffffff" />
      </Pressable>
      <DataCaptureView style={{ flex: 1 }} context={dataCaptureContext} ref={viewRef} />
      {isCameraTorchAvailable ? (
        <Pressable
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            padding: 16,
            zIndex: 10,
            borderRadius: 8,
            backgroundColor: isTorchOn ? '#ffffff' : 'rgba(0, 0, 0, 0.7)',
            borderWidth: 1
          }}
          onPress={toggleTorch}
        >
          <MaterialCommunityIcons
            name={isTorchOn ? 'flashlight' : 'flashlight-off'}
            size={16}
            color={isTorchOn ? '000000' : '#ffffff'}
          />
        </Pressable>
      ) : null}
    </>
  );
}
