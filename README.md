# MyCrop — Crop Recommendation & Disease Detection

A lightweight crop recommendation and plant disease detection project combining a Flask backend (Python) and an Expo React Native frontend. The backend exposes APIs for:

- Crop recommendation based on latitude/longitude (`/predict-crop`)
- Disease detection from an uploaded leaf image (`/predict-disease`)
- City → Lat/Lon geocoding (`/geocode-city`)

This README documents the complete workflow: setup, running the services, API usage examples, model files, and troubleshooting.

---

## Table of contents

- Project structure
- Requirements & environment
- Backend (Flask) setup and run
- API reference with examples
- Mobile app (Expo) setup and run
- Model files & placement
- Troubleshooting
- Next steps

## Project structure (top-level)

```
my_crop/
├─ app.py                      # Flask backend
├─ best_model.pth              # PyTorch model for disease detection
├─ crop_rf_model.joblib        # RandomForest crop recommendation model
├─ crop_label_encoder.joblib   # Label encoder for crop names
├─ final_dataset_cleaned.csv   # dataset used for training
├─ Disease_Info.txt            # extra disease info
├─ my_crop_app/                # Expo mobile app (React Native)
│  ├─ app/                     # app routes and screens
│  ├─ package.json
│  └─ README.md (app README)
└─ README.md                   # <-- this file
```

## Requirements & environment

This project uses Python for the backend and Node (Expo) for the frontend app.

Prerequisites
- Python 3.9+ (3.8 may work)
- Node.js 16+ (or compatible LTS)
- npm (comes with Node) or yarn
- Git (optional)

Recommended Python virtual environment workflow (PowerShell):

```powershell
# create venv
python -m venv .venv
# activate
.\.venv\Scripts\Activate.ps1
# upgrade pip
pip install --upgrade pip
```

Suggested Python packages (install after activating venv):

```powershell
pip install flask numpy pillow joblib scikit-learn wikipedia geopy requests
# CPU PyTorch (adjust per CUDA availability) — consult https://pytorch.org
pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu
```

Note: Installing PyTorch differs by platform and CUDA, so if you need GPU support, follow the official PyTorch selector: https://pytorch.org/get-started/locally/

(Optional) Create `requirements.txt`:

```
flask
numpy
pillow
joblib
scikit-learn
wikipedia
geopy
requests
torch
torchvision
```

Then install:

```powershell
pip install -r requirements.txt
```

## Backend (Flask) — run locally

1. Ensure you're in the root project folder (where `app.py` lives).
2. Activate your Python venv (PowerShell):

```powershell
.\.venv\Scripts\Activate.ps1
```

3. Start the Flask server:

```powershell
python app.py
```

The server binds to `0.0.0.0:5000` by default. You should see the Flask dev server logs. Keep in mind this is a development server; for production use a WSGI server like Gunicorn (Linux) or a proper host.

## API reference & examples

All endpoints assume the backend runs at: http://localhost:5000

1) POST /predict-crop
- Body: JSON with `latitude` and `longitude`.
- Returns: top 3 crop recommendations with confidences and short wiki info.

PowerShell example (Invoke-RestMethod):

```powershell
$body = @{ latitude = 23.5; longitude = 85.3 }
Invoke-RestMethod -Uri http://localhost:5000/predict-crop -Method Post -Body ($body | ConvertTo-Json) -ContentType 'application/json'
```

Sample response:

```json
{ "predictions": [ { "crop": "Rice", "confidence": 72.4, "info": "...", "wiki_url": "..." }, ... ] }
```

2) POST /predict-disease
- Form-data: file field named `file` (image of leaf)
- Returns: predicted class, confidence, green pixel ratio, margin, wikipedia summary and suggestions

PowerShell example (file upload):

```powershell
Invoke-RestMethod -Uri http://localhost:5000/predict-disease -Method Post -Form @{ file = Get-Item 'C:\path\to\leaf.jpg' }
```

Sample response:

```json
{ "class": "Tomato__Late_blight", "confidence": 0.87, "margin": 0.15, "green_ratio": 0.32, "info": "...", "suggestions": [...] }
```

3) GET /market
- Query param: `?crop=CropName`
- Returns: wikipedia summary + (attempted) market price data fetched from an external API.

PowerShell example:

```powershell
Invoke-RestMethod -Uri 'http://localhost:5000/market?crop=Tomato' -Method Get
```

4) POST /geocode-city
- Body: JSON with `city` string. Returns `latitude` and `longitude` from Nominatim geocoder.

PowerShell example:

```powershell
$body = @{ city = 'Ranchi' }
Invoke-RestMethod -Uri http://localhost:5000/geocode-city -Method Post -Body ($body | ConvertTo-Json) -ContentType 'application/json'
```

Security note: The backend calls external services (Wikipedia, datayuge prices API, geopy). Be mindful of rate limits and network connectivity.

## Mobile app (Expo) — run locally

The mobile app is under `my_crop_app/` (an Expo project). To run it:

```powershell
cd my_crop_app
npm install
npx expo start
```

Follow Expo's UI to run on Android Emulator, iOS Simulator (macOS), or Expo Go on a device.

If you want the mobile app to talk to the local backend on the same machine and test on a physical device, use your machine's LAN IP address (e.g., `http://192.168.1.10:5000`) and ensure the Flask server is reachable from the device (same network, firewall rules allow incoming on port 5000).

## Model files & placement

The Flask server expects the following files to be present in the same directory as `app.py`:

- `crop_rf_model.joblib` — scikit-learn RandomForest model for crop recommendation
- `crop_label_encoder.joblib` — label encoder mapping indices to crop names
- `best_model.pth` — PyTorch state dict for the ResNet18-based disease classifier

If you retrain models, ensure that:
- `best_model.pth` stores the model weights matching the network architecture in `app.py` (ResNet18 with final fc sized to 38 classes), or update `app.py` accordingly.
- `crop_rf_model.joblib` and `crop_label_encoder.joblib` use the same feature ordering expected by `predict-crop` (latitude, longitude).

## Troubleshooting

- Missing packages / import errors: activate venv and install packages listed above.
- PyTorch installation fails: follow the official instructions on https://pytorch.org; choose the right CUDA / CPU wheel for your environment.
- Wikipedia or external APIs return errors: these calls can fail when rate-limited or offline; the server gracefully returns a message in the `info` field when unavailable.
- Image upload errors: make sure the upload field name is `file` and the image is a valid RGB image.
- If the server is reachable locally but not from your phone: check firewall rules and that you used the machine IP (not `localhost`) in the mobile app.

## Next steps & improvements

- Add a `requirements.txt` or `environment.yml` for reproducible environments.
- Add unit tests for API endpoints (pytest + test client).
- Use Gunicorn + nginx (or a Docker container) for production hosting.
- Add model versioning and an admin UI for updating models without restarting the server.
- Improve inference speed and memory usage for the PyTorch model.
- Add authentication for the API endpoints if exposing publicly.

---

If you'd like, I can also:
- Add a `requirements.txt` file to the repo and install it in a venv.
- Create a minimal Postman collection for the APIs.
- Add a small integration test that exercises `/predict-crop` and `/geocode-city`.

Notes / assumptions made
- Assumed the Flask code in `app.py` is the authoritative server implementation (I read it to document endpoints).
- Assumed CPU PyTorch installation is acceptable; GPU installation instructions are left to the user per PyTorch docs.

---

Thanks — I created this `README.md` at the project root to document the full workflow. Let me know if you want the README adjusted to include screenshots, Postman examples, or CI/test instructions.