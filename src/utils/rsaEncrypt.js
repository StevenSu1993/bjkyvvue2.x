import JSEncrypt from 'jsencrypt/bin/jsencrypt.min'

// 密钥对生成 http://web.chacuo.net/netrsakeypair

const publicKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCu22uuenJXyWQ1opAH9piSalTFrtL0PWUoYtd7+4+qZWkDj5t+LVRu9VOtHDlcOO8M/deHoxEOaM7L68Qp83OcZ292lUKzrNbFHSWPaRyHQArrbv8x+0QgxJWjHgN4xQYeTRNNBNixx//N4kTgOFHwQvxn8VKoqnugc7Wf4ILwewIDAQAB'

const privateKey = 'MIICdgIBADANBgkqhkiG9w0BAQEFAASCAmAwggJcAgEAAoGBAK7ba656clfJZDWikAf2mJJqVMWu0vQ9ZShi13v7j6plaQOPm34tVG71U60cOVw47wz914ejEQ5ozsvrxCnzc5xnb3aVQrOs1sUdJY9pHIdACutu/zH7RCDElaMeA3jFBh5NE00E2LHH/83iROA4UfBC/GfxUqiqe6BztZ/ggvB7AgMBAAECgYAaZSsDIp7CG7eR1SFS4mmzqHN1h+d2URJFH26R266bNUW98N6zFFqriUMBXcJW5o1Hc8YmRnpbp3yYEdYB0ys/UASX6ycA2V4Gu9vmzFOAKvYZ0KC7cAJ9H1LY8OHbPnbV0uu674+tJxFgUnfi8W6qwmU2Uy6htHWnwJiwdlrICQJBANjbkcBXxn07zWCqccr6xCI20qozvSM+r52sfYwh6u6ynWiiR+tZtgpCZGshj/DHNizjUjVF4q0gFg7z1IBOWrcCQQDOax0RmdqspUo8FtoFefaz/C+SwrVV8KjRag78f8MVYtdNM+BmDMUsZtFddnIDwSq6Df2vSzD8/Glk3/3Bx+RdAkEAjsHkrjFaWoDuz88EwDHawgdDIYaT4UrYAz1VHNYLOX3d/86s97MEErboMlpSzpfmAyDWsnlCIuQ3gTpkzt5F+wJAJ1UxzNDMYml8o8aW9MQwxksfpY+EjkO1Z3IWOPb/bWvQKt3fvJJiX/uXmX+gaia8xYc099oUE6DlVFt6Nxqn4QJAeAz/SS77MfZdfY7K4+vXVb23uK9srSADGF0aYFGtVaUkJRWMddV3/WAdyQXxGsmFFOGnxQJgqcY/9j/voWk0eA=='

// 加密
export function encrypt (txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPublicKey(publicKey) // 设置公钥
  return encryptor.encrypt(txt) // 对需要加密的数据进行加密
}

// 解密
export function decrypt (txt) {
  const encryptor = new JSEncrypt()
  encryptor.setPrivateKey(privateKey)
  return encryptor.decrypt(txt)
}
