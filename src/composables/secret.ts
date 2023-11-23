import { ref } from 'vue'
import cryptoJs from 'crypto-js'

const getSecretKey = () => 'heora'

export const useSecret = () => {
  const apiKey = ref('')

  const saveAPIKey = (apiKey: string) => {
    const aesAPIKey = cryptoJs.AES.encrypt(apiKey, getSecretKey()).toString()
    localStorage.setItem('apiKey', aesAPIKey)
    return true
  }

  const getAPIKey = () => {
    if (apiKey.value) return apiKey.value
    const aesAPIKey = localStorage.getItem('apiKey') ?? ''
    apiKey.value = cryptoJs.AES.decrypt(aesAPIKey, getSecretKey()).toString(
      cryptoJs.enc.Utf8
    )
    return apiKey.value
  }

  return {
    saveAPIKey,
    getAPIKey
  }
}
