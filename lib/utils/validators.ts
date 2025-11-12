export const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export const validateFileSize = (file: File, maxSizeMB: number): boolean => {
  const maxBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxBytes
}

export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.name.toLowerCase().endsWith(type))
}

export const validateDataset = (data: any[]): { valid: boolean; error?: string } => {
  if (!Array.isArray(data)) {
    return { valid: false, error: 'Data must be an array' }
  }

  if (data.length === 0) {
    return { valid: false, error: 'Dataset cannot be empty' }
  }

  if (data.length > 50000) {
    return { valid: false, error: 'Dataset exceeds maximum of 50,000 rows' }
  }

  return { valid: true }
}