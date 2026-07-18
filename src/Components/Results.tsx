'use client'

import { ImageType } from '../types'
import Image from 'next/image'

interface DisplayProps {
  image: ImageType
}

const Display: React.FC<DisplayProps> = ({ image }: { image: ImageType }) => {
  const { title, image_id, artist_display } = image
  /* The `eslint-disable` is a big red flag: the project's own
      linter is telling to use `next/image`. 
      `next/image` handles all three out of the box (sizing,
      lazy-loading, blur placeholder) and gives you responsive sizes for free
       */
  return (
    <div
      style={{
        margin: '1em',
        border: '1px solid',
        padding: '1em',
        background: '#222',
        display: 'flex',
        maxWidth: '400px',
      }}
    >
      <Image
        src={`https://www.artic.edu/iiif/2/${image_id}/full/400,/0/default.jpg`}
        alt={title || 'Artwork from the Art Institute of Chicago'}
        width={200}
        height={100}
        loading="lazy"
        unoptimized
      />
      <div style={{ marginLeft: '1em' }}>
        <h2 style={{ marginBottom: '0.5em' }}>{title}</h2>
        <p style={{ marginTop: '0.5em' }}>{artist_display}</p>
      </div>
    </div>
  )
}

type ResultsProps = {
  data: ImageType[]
}

const filterOutNudity = (data: ImageType[]) => {
  const filteredData: ImageType[] = []

  for (let i = 0; i < data.length; i++) {
    if (!data[i].title.match(/nud(e|ity)/i)) {
      filteredData.push(data[i])
    }
  }

  return filteredData
}

const Results = ({ data }: ResultsProps): JSX.Element => {
  /*removing isLoading as there is no purpose of using isLoading here as
   it doesn't return anything. Ressults job is only to return data when available */

  //if (isLoading) return <></>
  //It breaks the mental model that props are immutable.
  const sorted = [...data].sort((a, b) => b._score - a._score)
  const sanitizedData = filterOutNudity(sorted)

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {sanitizedData.map((image, i) => (
        //1. using key as index is bad practice. If the underlying data reorders, React will have
        //issue identfying each element identically and causes wrong image rendering for wrong title
        //2. Pass the object as one explicit prop:
        <Display key={image.image_id} image={image} />
      ))}
    </div>
  )
}

export default Results
