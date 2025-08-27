// app/lib/healthClassificationService.ts - Simple mock service (no ML libs)

export interface HealthPrediction {
  prediction: 'Healthy' | 'Unhealthy';
  confidence: number;
  timestamp: string;
}

class HealthClassificationService {
  private isInitialized = false;
  private labels: string[] = ['Healthy', 'Unhealthy'];

  async initialize(): Promise<void> {
    if (this.isInitialized) return;
    
    // Simple mock initialization
    await new Promise(resolve => setTimeout(resolve, 200));
    this.isInitialized = true;
    console.log('Health classification service initialized');
  }

  async loadModel(): Promise<void> {
    await this.initialize();
    console.log('Health classification model ready (mock)');
  }

  async classifyHealth(imageUri: string): Promise<HealthPrediction> {
    // Ensure initialized
    await this.initialize();
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Simple hash to get consistent results per image URI
    let hash = 0;
    for (let i = 0; i < imageUri.length; i++) {
      hash = (hash * 31 + imageUri.charCodeAt(i)) >>> 0;
    }
    
    const isHealthy = (hash % 2) === 0;
    const confidence = 75 + (hash % 20); // 75-94% confidence
    
    return {
      prediction: isHealthy ? 'Healthy' : 'Unhealthy',
      confidence: Number(confidence.toFixed(1)),
      timestamp: new Date().toISOString()
    };
  }

  // Mock classification for testing
  async mockClassifyHealth(): Promise<HealthPrediction> {
    return this.classifyHealth('mock-image-uri');
  }

  isReady(): boolean {
    return this.isInitialized;
  }

  getModelStatus(): string {
    return this.isInitialized ? 'Ready (mock)' : 'Not initialized';
  }
}

// Export singleton instance
export const healthClassificationService = new HealthClassificationService();

// Auto-initialize
healthClassificationService.initialize().catch((e) => 
  console.warn('Health classification service init failed:', e)
);
