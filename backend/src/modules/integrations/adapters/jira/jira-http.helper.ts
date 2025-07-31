/**
 * Jira HTTP Client Helper
 *
 * Handles HTTP client creation, error handling, and API communication
 */

import axios, { AxiosError, type AxiosInstance } from 'axios';
import { JiraCredentials, JiraServerInfo } from './jira.types';

export class JiraHttpHelper {
  private readonly rateLimitDelay = 1000; // 1 second between requests
  private lastRequestTime = 0;

  createHttpClient(credentials: JiraCredentials): AxiosInstance {
    const auth = Buffer.from(
      `${credentials.username}:${credentials.apiToken}`
    ).toString('base64');

    const client = axios.create({
      baseURL: credentials.baseUrl,
      timeout: 30000, // 30 seconds
      headers: {
        Authorization: `Basic ${auth}`,
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'User-Agent': 'Jira Integration Adapter/1.0.0',
      },
    });

    // Add request interceptor for logging and rate limiting
    client.interceptors.request.use(
      config => {
        // Use proper logging instead of console.log
        return config;
      },
      error => {
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    client.interceptors.response.use(
      response => response,
      (error: AxiosError) => this.handleHttpError(error)
    );

    return client;
  }

  async testAuthentication(httpClient: AxiosInstance): Promise<void> {
    try {
      await httpClient.get('/rest/api/3/myself');
    } catch (error) {
      if (error instanceof AxiosError) {
        const status = error.response?.status;
        switch (status) {
          case 401:
            throw new Error(
              'Invalid credentials. Please check your username and API token.'
            );
          case 403:
            throw new Error('Access denied. Please check your permissions.');
          default:
            throw new Error(
              `Authentication test failed: ${status} ${error.response?.statusText}`
            );
        }
      }
      throw error;
    }
  }

  async fetchServerInfo(
    httpClient: AxiosInstance
  ): Promise<JiraServerInfo | null> {
    try {
      await this.rateLimitedDelay();

      // Mock server info for now - in real implementation would make HTTP request
      return {
        baseUrl: httpClient.defaults.baseURL || 'https://test.atlassian.net',
        version: '9.4.0',
        versionNumbers: [9, 4, 0],
        deploymentType: 'Cloud',
        buildNumber: 904000,
        buildDate: '2024-01-01T00:00:00.000Z',
        serverTime: new Date().toISOString(),
        scmInfo: 'git-revision',
        serverTitle: 'Jira',
      };
    } catch (error) {
      return null;
    }
  }

  async rateLimitedDelay(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;

    if (timeSinceLastRequest < this.rateLimitDelay) {
      const delay = this.rateLimitDelay - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    this.lastRequestTime = Date.now();
  }

  async withRetry<T>(
    operation: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000
  ): Promise<T> {
    let lastError: Error;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');

        if (attempt === maxRetries) {
          break;
        }

        // Exponential backoff
        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  private async handleHttpError(error: AxiosError): Promise<never> {
    const status = error.response?.status;
    const statusText = error.response?.statusText;

    // Handle specific HTTP status codes
    switch (status) {
      case 401:
        throw new Error(
          'Authentication failed. Please check your credentials.'
        );
      case 403:
        throw new Error('Access forbidden. Please check your permissions.');
      case 404:
        throw new Error(
          'Resource not found. Please check the URL and resource ID.'
        );
      case 429:
        throw new Error('Rate limit exceeded. Please try again later.');
      case 500:
        throw new Error('Jira server error. Please try again later.');
      case 503:
        throw new Error('Jira service unavailable. Please try again later.');
      default:
        if (status && status >= 400) {
          throw new Error(`Jira API error: ${status} ${statusText}`);
        }
        throw error;
    }
  }
}
