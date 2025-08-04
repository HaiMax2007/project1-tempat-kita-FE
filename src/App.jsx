import { useState } from 'react'
import axios from 'axios'
import { Shield, Sparkles, Link, Search, FileText, CheckCircle, AlertCircle } from 'lucide-react'

function App() {
  const [url, setUrl] = useState({
    input: '',
    errors: null
  })
  const [title, setTitle] = useState({
    input: '',
    errors: null
  })
  const [linkData, setLinkData] = useState(null)
  const [titleData, setTitleData] = useState(null)
  const [error, setError] = useState({
    link: null,
    title: null
  })

  const handleLink = () => {
    setError({...error, link: null})
    setLinkData(null)
    if (!url.input) {
      setTitle({...title, errors: 'Please enter a link'})
      return
    }

    axios.post('https://09dc6e5b5bc5.ngrok-free.app/predict-news-link', {input: url.input}, {
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json',
      }
    })
      .then(res => setLinkData(res.data.prediction))
      .catch(err => setError({...error, link: err.response.data.error}))
  }
  
  const handleTitle = () => {
    setError({...error, title: null})
    setTitleData(null)
    if (!title.input) {
      setTitle({...title, errors: 'Please enter a news title'})
      return
    }
    
    axios.post('https://09dc6e5b5bc5.ngrok-free.app/predict-news-title', {input: title.input}, {
      headers: {
        "Content-Type": 'application/json',
        Accept: 'application/json',
      }
    })
      .then(res => setTitleData(res.data.prediction))
      .catch(err => setError({...error, title: err.response.data.error}))
  }

  return (
    <div className='container mx-auto p-4 flex flex-col items-center py-20'>
      <div className='flex flex-col items-center gap-4'>
        <div className="flex items-center justify-center gap-5">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-xl">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <Sparkles className="h-6 w-6 text-amber-500" />
        </div>
        <h1 className='text-5xl font-bold bg-gradient-to-r from-blue-400 to-indigo-800 bg-clip-text text-transparent leading-tight'>Deteksi Berita Hoax</h1>
        <h2 className='font-semibold text-xl text-center max-w-3xl'>Platform AI canggih untuk memverifikasikan keaslian berita dengan teknologi analisis mendalam</h2>
        <span className="flex items-center gap-2 text-sm text-black/60">
          <span className='w-[10px] h-[10px] bg-green-500 rounded-full animate-pulse'></span>
          <span>Powered by BERT</span>
        </span>
      </div>
      <div className="flex flex-col items-center mt-8 gap-5 w-[700px]">
        <div className=" w-full border border-gray-200 rounded-lg p-6 bg-white shadow-2xl space-y-4 overflow-hidden">
          <div className="flex gap-4">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl shadow-lg">
              <Link className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h3 className='font-semibold'>Analisis dari Link Berita</h3>
              <span className='text-sm'>Masukkan URL berita untuk verifikasi otomatis</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative grow">
              <input className='w-full h-full pl-10 rounded-xl shadow-sm focus:shadow-xl transition-all duration-300' type="text" value={url.input} onChange={e => setUrl({...url, input: e.target.value})} placeholder='https://contoh-web-berita.com/' />
              <Search className='h-4 w-4 text-slate-400 absolute top-1/2 left-4 -translate-y-1/2' />
            </div>
            <button className='cursor-pointer py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl font-semibold' onClick={handleLink}>
              Analisis Link
            </button>
          </div>
          {error.link && <span className='text-red-500'>{error.link}</span>}
          {
            linkData !== null && (
              <div className="flex gap-5 mt-10 p-5 shadow-xl rounded-lg">
                <div className={`${linkData.prediction == 'Real News' ? 'bg-emerald-200' : 'bg-red-200'} p-2 h-12 w-12 rounded-full`}>
                  {linkData.prediction == 'Real News' ? <CheckCircle className='h-full w-full text-emerald-600  '/> : <AlertCircle className='h-6 w-6 text-red-600' />}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-3 items-center">
                    {
                      linkData.prediction == 'Real News' ? (
                        <span className='px-4 py-2 text-white font-semibold bg-green-600 rounded-lg'>✓ Berita Asli</span>
                      ) : <span className='px-4 py-2 text-white font-semibold bg-red-600 rounded-lg uppercase'>⚠ Kemungkinan Hoax</span>
                    }
                    <span className='text-sm px-3 py-1 bg-slate-200 rounded-full'>Kepercayaan: <span className='font-bold text-lg'>{linkData.accuracy}</span></span>
                  </div>
                  {
                    linkData.prediction == 'Real News' ? <p className='text-sm'>Link ini mengarah ke sumber berita terpercaya dengan riwayat faktual yang baik dan kredibilitas tinggi.</p> : <p className='text-sm'>Link ini mengarah ke website yang sering menyebarkan informasi yang tidak terverifikasi dan berpotensi menyesatkan.</p>
                  }
                </div>
              </div>
            )
          }
        </div>
        <div className=" w-full border border-gray-200 rounded-lg p-6 bg-white shadow-2xl space-y-4">
          <div className="flex gap-4">
            <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl shadow-lg">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <h3 className='font-semibold'>Analisis dari Judul Berita</h3>
              <span className='text-sm'>Masukkan judul berita untuk deteksi clickbait</span>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="relative grow">
              <input className='w-full h-full pl-10 rounded-xl shadow-sm focus:shadow-xl transition-all duration-300' type="text" value={title.input} onChange={e => setTitle({...title, input: e.target.value})} placeholder='Enter a title of the news' />
              <FileText className='h-4 w-4 text-slate-400 absolute top-1/2 left-4 -translate-y-1/2' />
            </div>
            <button className='cursor-pointer py-3 px-5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-700 hover:to-pink-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 rounded-xl font-semibold' onClick={handleTitle}>
              Analisis Link
            </button>
          </div>
          {error.title && <span className='text-red-500 text-lg'>{error.title}</span>}
          {
            titleData !== null && (
              <div className="flex gap-5 mt-10 p-5 shadow-xl rounded-lg">
                <div className={`${titleData.prediction == 'Real News' ? 'bg-emerald-200' : 'bg-red-200'} p-2 h-12 w-12 rounded-full`}>
                  {titleData.prediction == 'Real News' ? <CheckCircle className='h-full w-full text-emerald-600  '/> : <AlertCircle className='h-6 w-6 text-red-600' />}
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-3 items-center">
                    {
                      titleData.prediction == 'Real News' ? (
                        <span className='px-4 py-2 text-white font-semibold bg-green-600 rounded-lg'>✓ Berita Asli</span>
                      ) : <span className='px-4 py-2 text-white font-semibold bg-red-600 rounded-lg uppercase'>⚠ Kemungkinan Hoax</span>
                    }
                    <span className='text-sm px-3 py-1 bg-slate-200 rounded-full'>Kepercayaan: <span className='font-bold text-lg'>{titleData.accuracy}</span></span>
                  </div>
                  {
                    titleData.prediction == 'Real News' ? <p className='text-sm'>Judul berita ini menggunakan bahasa yang objektif, tidak sensasional, dan sesuai dengan standar jurnalistik profesional.</p> : <p className='text-sm'>Judul berita ini mengandung kata-kata sensasional dan clickbait yang sering digunakan dalam berita hoax untuk menarik perhatian.</p>
                  }
                </div>
              </div>
            )
          }
        </div>
        <div className="flex gap-5 bg-gradient-to-r from-amber-50 to-orange-50 w-full p-6 rounded-lg shadow-lg">
          <div className="bg-amber-100 h-12 w-12 p-3 rounded-full">
            <AlertCircle className='text-red-600' />
          </div>
          <div className="flex flex-col gap-2">
            <h3 className='text-amber-800 font-bold'>Penting untuk diperhatikan!</h3>
            <p className='text-sm'>Hasil analisis ini bersifat indikatif dan menggunakan teknologi AI untuk memberikan prediksi berdasarkan pola data. Selalu lakukan verifikasi silang dengan sumber berita terpercaya dan resmi sebelum menyebarkan informasi.</p>
          </div>
        </div>
      </div> 
    </div>
  )
}

export default App
