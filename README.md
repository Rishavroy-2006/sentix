# NeuroSync

NeuroSync is a demo interface for an advanced EEG-based smart earpiece. It tracks neural states in real-time, providing personalized insights into Focus, Stress, and Sleep metrics.

## Features Currently Available in Demo

- **Dashboard:** At-a-glance 360 view of Focus Score, Live Neural Flow (simulated Alpha/Gamma waves), Stress Level, and actionable Daily Insights.
- **Focus Mode:** A specialized timer and environment generator built to enhance deep work intervals. It uses dynamic audio generation and public domain audio links to create soundscapes (Forest, Cosmos, White Noise).
- **Stress Monitor:** Simulates live HRV (Heart Rate Variability) tracking. Includes a guided coherence "Breathe to Focus" animated tool to restore neural calm.
- **Sleep Architecture:** Visualizes sleep stages (Awake, REM, Light, Deep) from the previous night, including a Nightly HRV chart.
- **Settings:** Device pairing status and app preferences.

## 🛠 Tech Stack

- **Framework:** React + TypeScript (via Vite)
- **Styling:** Tailwind CSS + Custom CSS aesthetics
- **Icons:** Lucide React
- **Mobile Capabilities:** Capacitor (for Android/iOS porting)

---

## 🚀 Running the App Locally (Web)

1. **Install Dependencies:**
   ```bash
   npm install
   ```
2. **Start the Development Server:**
   ```bash
   npm run dev
   ```
3. Open your browser to `http://localhost:3000`.

---

## 📱 Building the Android App (via Android Studio)

NeuroSync is configured with **Capacitor**, letting you easily wrap the web experience into a native Android app.

### Prerequisites:
- Install [Android Studio](https://developer.android.com/studio).
- Install the Android SDK and have an Android Emulator or physical device ready.

### Steps to Build Android:

1. **Initialize the Android Platform (One-time setup):**
   ```bash
   npx cap add android
   ```
   *(Note: This creates an `/android` folder in the project. Do not modify the contents manually unless necessary, as web updates will sync automatically).*

2. **Build and Sync the Application:**
   Compile the Vite web assets and sync them over to the Android platform:
   ```bash
   npm run android:sync
   ```

3. **Open Android Studio:**
   ```bash
   npm run android:open
   ```
   This command will automatically open the project in Android Studio. From there, you can build the APK, run it on a virtual emulator, or push it straight to your connected device.

