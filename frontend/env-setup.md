# 🔧 Frontend Environment Setup

## 🚨 IMPORTANT: Create .env file

You need to create a `.env` file in the `frontend/` directory with this exact content:

```env
REACT_APP_API_URL=http://localhost:3333/api
REACT_APP_FRONTEND_URL=http://localhost:3000
REACT_APP_ENABLE_ANALYTICS=false
REACT_APP_ENABLE_DEBUG_LOGGING=false
```

## 📁 File Location
```
greenguest/
├── frontend/
│   ├── .env  ← CREATE THIS FILE HERE
│   ├── src/
│   └── package.json
└── src/ (backend)
```

## 🔍 How to Create .env File

### Option 1: File Explorer
1. Go to `frontend/` folder
2. Right-click → New → Text Document
3. Name it `.env` (with the dot!)
4. Open and paste the content above
5. Save

### Option 2: Command Line
```bash
cd frontend
echo "REACT_APP_API_URL=http://localhost:3333/api" > .env
echo "REACT_APP_FRONTEND_URL=http://localhost:3000" >> .env
echo "REACT_APP_ENABLE_ANALYTICS=false" >> .env
echo "REACT_APP_ENABLE_DEBUG_LOGGING=false" >> .env
```

## 🚀 Start Both Servers

### 1. Start Backend (Terminal 1)
```bash
cd src
npm run start:dev
# Should show: 🚀 Application is running on: http://localhost:3333
```

### 2. Start Frontend (Terminal 2)
```bash
cd frontend
npm start
# Should open: http://localhost:3000
```

## ✅ Test Connection

1. Open your browser to `http://localhost:3000`
2. Look for the blue "Test API" button in the header
3. Click it to test backend connectivity
4. Check browser console for results

## 🐛 Troubleshooting

### Backend Not Starting?
- Check if port 3333 is available
- Run `npm install` in `src/` folder
- Check for TypeScript errors

### Frontend Can't Connect?
- Ensure backend is running on port 3333
- Check if `.env` file exists and has correct content
- Restart frontend after creating `.env`
- Check browser console for CORS errors

### CORS Errors?
- Backend CORS is configured for `http://localhost:3000`
- Make sure both servers are running
- Check browser network tab for failed requests

## 🔗 Connection Status

- ✅ **Backend Running**: Port 3333 accessible
- ✅ **Frontend Running**: Port 3000 accessible  
- ✅ **Environment Set**: `.env` file created
- ✅ **CORS Configured**: Backend allows frontend origin
- ✅ **API Endpoints**: All services properly configured

Once all steps are completed, your frontend will be fully connected to your backend!
