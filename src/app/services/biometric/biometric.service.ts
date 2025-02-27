import { Injectable } from '@angular/core';
import { NativeBiometric } from '@capgo/capacitor-native-biometric';

@Injectable({
  providedIn: 'root',
})
export class BiometricService {
  async isBiometricActive(): Promise<boolean> {
    try {
      const credentials = await this.getCredentials();
      return !!credentials;
    } catch (error) {
      console.error(
        '❌ Error al verificar si la biometría está activa:',
        error
      );
      return false;
    }
  }

  async biometricVerification(): Promise<void> {
    console.log('➡️ Iniciando verificación biométrica');

    try {
      const isAvailable = await NativeBiometric.isAvailable();
      console.log('🔹 Biometrics disponibles:', isAvailable);

      if (!isAvailable)
        throw new Error('Biometric authentication not available');

      await NativeBiometric.verifyIdentity({
        reason: 'Ingreso seguro',
        title: 'Autenticación de identidad',
        subtitle: 'Verifique su identidad para ingresar',
        description: 'Para continuar debe verificar su identidad',
        maxAttempts: 5,
        useFallback: true,
      });

      console.log('✅ Autenticación biométrica exitosa');
    } catch (error) {
      console.error('❌ Fallo en autenticación biométrica:', error);
      throw error;
    }
  }

  async getCredentials(): Promise<any> {
    try {
      const credentials = await NativeBiometric.getCredentials({
        server: 'www.example.com',
      });

      if (!credentials) return null;

      return credentials;
    } catch (error) {
      console.error('Error obteniendo credenciales:', error);
      return null;
    }
  }

  async setCredentials({ email, password }: any) {
    return NativeBiometric.setCredentials({
      username: email,
      password,
      server: 'www.example.com',
    });
  }

  async deleteCredentials() {
    await NativeBiometric.deleteCredentials({
      server: 'www.example.com',
    });
  }
}
