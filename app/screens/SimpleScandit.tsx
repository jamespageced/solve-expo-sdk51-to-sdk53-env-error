import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus, BackHandler, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { AMS_365_SCANDIT_LICENSE_KEY, AMS_MOBILE_SCANDIT_LICENSE_KEY, MOBILE_ENV } from '@env';
import { StackActions, useIsFocused, useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import {
  Barcode,
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
  LaserlineViewfinder,
  LaserlineViewfinderStyle,
  RectangularViewfinder,
  RectangularViewfinderStyle,
  RectangularViewfinderLineStyle,
  VideoResolution
} from 'scandit-react-native-datacapture-core';
import { useScanditStore } from '@app/stores';
import { requestCameraPermissionsIfNeeded } from '@app/utils';
import type { ScanditStore, StackParamsList } from '@app/types';

export default function SimpleScan(): JSX.Element {
  const isFocused = useIsFocused();
  const viewRef = useRef<DataCaptureView>(null);
  const dataCaptureContext = useMemo(() => {
    return DataCaptureContext.forLicenseKey(
      MOBILE_ENV === 'prod' && Platform.OS === 'android' ? AMS_365_SCANDIT_LICENSE_KEY : AMS_MOBILE_SCANDIT_LICENSE_KEY
    );
  }, []);
  const navigation: any = useNavigation<StackNavigationProp<StackParamsList>>();
  const { simpleScanditResults, setSimpleScanditResults } = useScanditStore((store: ScanditStore) => store);
  const [camera, setCamera] = useState<Camera | null>(Camera.default);
  const [barcodeCaptureMode, setBarcodeCaptureMode] = useState<BarcodeCapture | null>(null);
  const [isBarcodeCaptureEnabled, setIsBarcodeCaptureEnabled] = useState(false);
  const [cameraState, setCameraState] = useState<FrameSourceState | null>(null);

  // Due to a React Native issue with firing the AppState 'change' event on iOS, we want to avoid triggering
  // a startCapture/stopCapture on the scanner twice in a row. We work around this by keeping track of the
  // latest command that was run, and skipping a repeated call for starting or stopping scanning.
  const lastCommand = useRef<string | null>(null);

  const handleAppStateChange = (nextAppState: AppStateStatus) => {
    if (nextAppState.match(/inactive|background/)) {
      stopCapture();
    } else {
      startCapture();
    }
  };

  const setupScanning = () => {
    // Use the world-facing (back) camera and set it as the frame source of the context. The camera is off by
    // default and must be turned on to start streaming frames to the data capture context for recognition.
    const cameraSettings = new CameraSettings();
    cameraSettings.preferredResolution = VideoResolution.FullHD;
    camera?.applySettings(cameraSettings);

    dataCaptureContext.setFrameSource(camera);
    setCamera(camera);

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

    // Register a listener to get informed whenever a new barcode got recognized.
    const barcodeCaptureListener = {
      didScan: (_: BarcodeCapture, session: BarcodeCaptureSession) => {
        const barcode: Barcode | null = session.newlyRecognizedBarcode;
        if (barcode === null) {
          const symbology = new SymbologyDescription(Symbology.QR);
          navigation.goBack();
          return;
        }
        // prevent random scans from happening, and only scan the barcode
        const symbology = new SymbologyDescription(barcode.symbology);

        // add scan results to the store
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
    overlay.viewfinder = new LaserlineViewfinder(LaserlineViewfinderStyle.Animated);
    /* or
    overlay.viewfinder = new RectangularViewfinder(RectangularViewfinderStyle.Legacy);
    overlay.viewfinder = new RectangularViewfinder(RectangularViewfinderStyle.Square);
    overlay.viewfinder = new RectangularViewfinder(RectangularViewfinderStyle.Light);
    */
    viewRef.current?.addOverlay(overlay);
    setBarcodeCaptureMode(barcodeCapture);
  };

  const startCapture = async () => {
    if (lastCommand.current === 'startCapture') {
      return;
    }
    lastCommand.current = 'startCapture';
    startCamera();
  };

  const stopCapture = () => {
    if (lastCommand.current === 'stopCapture') {
      return;
    }
    lastCommand.current = 'stopCapture';
    stopCamera();
  };

  const startCamera = () => {
    // Switch camera on to start streaming frames and enable the barcode capture mode.
    // The camera is started asynchronously and will take some time to completely turn on.
    requestCameraPermissionsIfNeeded()
      .then(() => setCameraState(FrameSourceState.On))
      .catch(() => BackHandler.exitApp());
  };

  const stopCamera = () => {
    if (camera) {
      setCameraState(FrameSourceState.Off);
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  useEffect(() => {
    const handleAppStateChangeSubscription = AppState.addEventListener('change', handleAppStateChange);
    setupScanning();
    startCapture();
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleCancel();
      return true;
    });
    return () => {
      handleAppStateChangeSubscription.remove();
      stopCapture();
      dataCaptureContext.dispose();
      backHandler.remove();
    };
  }, []);

  useEffect(() => {
    if (camera) {
      if (cameraState === null) {
        camera.switchToDesiredState(FrameSourceState.Off);
      } else {
        camera.switchToDesiredState(cameraState);
      }
    }
    if (cameraState === FrameSourceState.On) {
      setIsBarcodeCaptureEnabled(true);
    } else if (cameraState === FrameSourceState.Off) {
      setIsBarcodeCaptureEnabled(false);
    }
  }, [cameraState]);

  useEffect(() => {
    if (barcodeCaptureMode) {
      barcodeCaptureMode.isEnabled = isBarcodeCaptureEnabled;
    }
    // handle screen return
    if (!isFocused || (isFocused && !simpleScanditResults)) return;
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [isBarcodeCaptureEnabled]);

  useEffect(() => {
    // after updating scan results
    // stop camera and get ready to return to previous screen
    if (isFocused && !!simpleScanditResults) {
      stopCapture();
    }
  }, [simpleScanditResults]);

  return (
    <View style={StyleSheet.absoluteFill}>
      <Pressable
        style={{
          position: 'absolute',
          top: 10,
          right: 10,
          paddingHorizontal: 16,
          paddingVertical: 8,
          zIndex: 10,
          borderRadius: 4,
          borderColor: '#ffffff',
          borderWidth: 1
        }}
        onPress={handleCancel}
      >
        <Text style={{ color: '#ffffff' }}>Cancel</Text>
      </Pressable>
      <DataCaptureView style={{ flex: 1 }} context={dataCaptureContext} ref={viewRef} />
    </View>
  );
}
