import apiService from './api';

export class ConnectionTestService {
  static async testBackendConnection(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      console.log('🔍 Testing backend connection...');
      console.log('📍 API URL:', process.env.REACT_APP_API_URL || 'http://localhost:3333/api');
      
      // Test basic connectivity
      const response = await fetch('http://localhost:3333/api/health', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Backend connection successful!');
        return {
          success: true,
          message: 'Backend connection successful',
          details: data
        };
      } else {
        console.log('❌ Backend responded with error:', response.status, response.statusText);
        return {
          success: false,
          message: `Backend error: ${response.status} ${response.statusText}`
        };
      }
    } catch (error) {
      console.error('❌ Backend connection failed:', error);
      return {
        success: false,
        message: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  static async testAuthEndpoint(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      console.log('🔍 Testing auth endpoint...');
      
      const response = await apiService.get('/auth/profile');
      console.log('✅ Auth endpoint working!');
      return {
        success: true,
        message: 'Auth endpoint working',
        details: response
      };
    } catch (error) {
      console.log('❌ Auth endpoint failed:', error);
      return {
        success: false,
        message: `Auth endpoint failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  static async testProductEndpoint(): Promise<{
    success: boolean;
    message: string;
    details?: any;
  }> {
    try {
      console.log('🔍 Testing product endpoint...');
      
      const response = await apiService.get('/products/getAllProducts');
      console.log('✅ Product endpoint working!');
      return {
        success: true,
        message: 'Product endpoint working',
        details: { count: Array.isArray(response) ? response.length : 'Unknown' }
      };
    } catch (error) {
      console.log('❌ Product endpoint failed:', error);
      return {
        success: false,
        message: `Product endpoint failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      };
    }
  }

  static async runFullConnectionTest(): Promise<void> {
    console.log('🚀 Starting full connection test...');
    console.log('=====================================');
    
    const results = await Promise.all([
      this.testBackendConnection(),
      this.testAuthEndpoint(),
      this.testProductEndpoint()
    ]);

    console.log('=====================================');
    console.log('📊 Connection Test Results:');
    
    results.forEach((result, index) => {
      const testNames = ['Backend Connection', 'Auth Endpoint', 'Product Endpoint'];
      console.log(`${result.success ? '✅' : '❌'} ${testNames[index]}: ${result.message}`);
    });

    const allSuccessful = results.every(r => r.success);
    if (allSuccessful) {
      console.log('🎉 All tests passed! Frontend is fully connected to backend.');
    } else {
      console.log('⚠️  Some tests failed. Check the details above.');
    }
  }
}

export default ConnectionTestService;
