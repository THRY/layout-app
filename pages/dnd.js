import Head from 'next/head';
import Image from 'next/image';
import ChangeTitle from '../components/ChangeTitle';
import ClientOnly from '../components/ClientOnly';
import LogIn from '../components/LogIn';
import PlaceImages from '../components/PlaceImages';
import styles from '../styles/Home.module.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DragExample } from '../components/dnd/DragExample';

export default function Dnd() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name='description' content='Generated by create next app' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className={styles.main}>
        <DndProvider backend={HTML5Backend}>
          <DragExample />
        </DndProvider>
      </main>

      <footer className={styles.footer}></footer>
    </div>
  );
}