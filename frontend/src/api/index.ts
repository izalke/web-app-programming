import axios, { AxiosInstance } from "axios"

class API {
  baseURL: string
  instance: AxiosInstance

  constructor(baseURL: string) {
    this.baseURL = baseURL
    this.instance = axios.create({
      baseURL: baseURL,
    })
  }

  sendContactRequest = async (contactData: any) => {
    return this.instance.post(`/contact/vroom`, contactData)
  }

  sendMailWithAttachment = async (contactData: any) => {
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
    return this.instance.post(
      "/contact/vroom/attachments",
      contactData,
      config
    )
  }
}

const api = new API("https://")

export default api
