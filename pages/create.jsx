import Head from 'next/head'
import { Navbar } from '@/components/Navbar'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Create() {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [image, setImage] = useState('')
  const [price, setPrice] = useState('')
  const [ticketPrice, setTicketPrice] = useState('')
  const [expiresAt, setExpiresAt] = useState('')
  const router = useRouter()

  const handleSubmit = (e) => {
    console.log('handleSubmit---000--->')
    e.preventDefault()
    if (!title || !description || !image || !price || !ticketPrice || !expiresAt) return
    const params = {
      title,
      description,
      image,
      price,
      ticketPrice,
      expiresAt: new Date(expiresAt).getTime(),
    }
    console.log('handleSubmit--->', params)
    onReset()
    router.push('/')
  }

  const onReset = () => {
    setTitle('')
    setDescription('')
    setImage('')
    setPrice('')
    setTicketPrice('')
    setExpiresAt('')
  }

  return (
    <div>
      <Head>
        <title>Dapp-Lottery - Create New Jackpot</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Navbar />
      <div className="pt-20">
        <h1 className="text-xl font-extrabold text-center">Create New Jackpot</h1>
        <p className="text-center mt-3">
          We bring a persolan and effective every project we work on. <br />
          which is why our client love why they keep coming back.
        </p>
      </div>
      <div className="flex justify-center items-center mt-20">
        <form onSubmit={handleSubmit} className="w-full max-w-md">
          <div className="mb-4">
            <input
              id="title"
              type="text"
              className="w-full border py-2 px-3 rounded text-gray-700 leading-tight appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              id="image"
              type="text"
              className="w-full border py-2 px-3 rounded text-gray-700 leading-tight appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              id="price"
              type="text"
              className="w-full border py-2 px-3 rounded text-gray-700 leading-tight appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              id="ticketPrice"
              type="text"
              className="w-full border py-2 px-3 rounded text-gray-700 leading-tight appearance-none focus:outline-none focus:shadow-outline"
              placeholder="TicketPrice"
              value={ticketPrice}
              onChange={(e) => setTicketPrice(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <input
              id="expiresAt"
              type="datetime-local"
              className="w-full border py-2 px-3 rounded text-gray-700 leading-tight appearance-none focus:outline-none focus:shadow-outline"
              placeholder="TicketPrice"
              value={expiresAt}
              onChange={(e) => setExpiresAt(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              id="description"
              className="w-full border py-2 px-3 rounded text-gray-700 leading-tight appearance-none focus:outline-none focus:shadow-outline"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full bg-[#ea580c] font-bold text-white px-4 py-2 focus:outline-none focus:shadow-outline"
            >
              Submit Jackpot
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
