import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { CircleLoader } from 'react-spinners';

const Home: NextPage = () => {
  const [resultsCount, setResultsCount] = useState(0);
  const [keyword, setKeyword] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  let offset = 0;
  const baseUrl = 'https://itunes.apple.com/search?';
  const itunesUrl =
    'https://developer.apple.com/library/archive/documentation/AudioVideo/Conceptual/iTuneSearchAPI/Searching.html#//apple_ref/doc/uid/TP40017632-CH5-SW1';

  const searchCollection = (limit: number = 10) => {
    console.log('The function is triggered==<');
    setLoading(true);
    axios
      .get(`${baseUrl}term=${keyword}&limit=${limit}&offset=${offset}`)
      .then(({ data }) => {
        console.log('The results are found==<', keyword, offset, limit, data);
        const { results } = data;
        if (results.length) offset += limit;
        setData(res => [...res, ...results]);
        setLoading(false);
      })
      .catch(err => console.log(err));
  };

  const handleScroll = ({ target }: any) => {
    const { innerHeight } = window;
    const { scrollTop, scrollHeight } = target.documentElement;
    if (innerHeight + scrollTop + 1 >= scrollHeight) {
      console.log('The scroll event ==>');
      searchCollection();
    }
  };

  const handleTextChange = ({ target }: any) => {
    setKeyword(target.value);
  };

  useEffect(() => {
    searchCollection();
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
          <input className={styles.input} placeholder='Search....' onChange={handleTextChange} />
          <button className={styles.btn} onClick={() => searchCollection()}>
            Go
          </button>
        </div>

        {data.length ? <h4>Displaying ${resultsCount} results matching your query.</h4> : null}

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
          {loading ? <CircleLoader /> : null}
        </div>
      </main>

      <footer className={styles.footer}>
        <a href={itunesUrl} target='_blank' rel='noopener noreferrer'>
          Powered by&emsp;
          <Image src='/itunes.svg' alt='itunes' width={30} height={30} />
        </a>
      </footer>
    </div>
  );
};

export default Home;
