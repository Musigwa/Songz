import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import React, { useState, useEffect, useMemo, useRef } from 'react';
import axios from 'axios';
import { CircleLoader } from 'react-spinners';

const Home: NextPage = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(false);
  const inputRef = useRef(null);

  let offset = 0;
  const baseUrl = 'https://itunes.apple.com/search?';
  const itunesUrl =
    'https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html#//apple_ref/doc/uid/TP40017632-CH5-SW1';

  const searchCollection = (shouldClear = false, limit: number = 10) => {
    const { value }: { value: string } = inputRef.current!;
    if (value.length >= 3) {
      setLoading(true);
      setError(false);
      axios
        .get(`${baseUrl}term=${value}&limit=${limit}&offset=${offset}`)
        .then(({ data: res }) => {
          const { results } = res;
          if (results.length) offset += limit;
          setHasSearched(true);
          setData(shouldClear ? results : res => [...res, ...results]);
          setLoading(false);
        })
        .catch(err => console.log(err));
    } else setError(true);
  };

  const handleScroll = ({ target }: any) => {
    const { innerHeight } = window;
    const { scrollTop, scrollHeight } = target.documentElement;
    if (innerHeight + scrollTop + 1 >= scrollHeight) {
      searchCollection();
    }
  };

  const handleSearchClick = () => searchCollection(true);

  useEffect(() => {
    window.onscroll = handleScroll;
  }, []);

  return (
    <div className={styles.container}>
      <Head>
        <title>Songz</title>
        <meta name='description' content='' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <h2 className={styles.title}>Time to relax!</h2>
        <h3>Search for your favorite music, albums, collections, mixes,...</h3>
        <div>
          <input ref={inputRef} className={styles.input} placeholder='Search....' />
          <button className={styles.btn} onClick={handleSearchClick}>
            Go
          </button>
        </div>
        {error ? <h6>Please type at least 3 characters!</h6> : null}
        {data.length ? (
          <>
            <h4>
              Displaying <span style={{ color: 'cadetblue' }}>{data.length} results</span> matching
              your query.
            </h4>
            <div className={styles.grid}>
              {data.map(({ artistName, collectionName, trackName, artworkUrl100 }, idx) => {
                return (
                  <div key={idx} className={styles.card}>
                    <h2>{trackName} &rarr;</h2>
                    <Image
                      loader={() => artworkUrl100}
                      src={artworkUrl100}
                      alt='thumbnail'
                      width={300}
                      height={300}
                    />
                    <p>{collectionName}</p>
                  </div>
                );
              })}
            </div>
          </>
        ) : hasSearched ? (
          <h2>No results matching your search!</h2>
        ) : null}
        {loading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}
          >
            <h3 style={{ color: 'cadetblue' }}>Loading collections...&emsp;</h3>
            <CircleLoader color='cadetblue' />
          </div>
        ) : null}
      </main>

      <footer className={styles.footer}>
        <a href={itunesUrl} target='_blank' rel='noopener noreferrer'>
          Powered by&ensp;Apple Music&emsp;
          <Image src='/itunes.svg' alt='itunes' width={30} height={30} />
          &emsp;Formely (iTunes)
        </a>
      </footer>
    </div>
  );
};

export default Home;
