import { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';
// import OptimizeTest from './OptimizeText';
// import Lifecycle from './Lifecylcle';

// https://jsonplaceholder.typicode.com/comments

// const dummyList = [
//   {
//     id: 1,
//     author: '하유나',
//     content: '하이 1',
//     emotion: 5,
//     created_date: new Date().getTime(),
//   },
//   {
//     id: 2,
//     author: '심현정',
//     content: '하이 2',
//     emotion: 2,
//     created_date: new Date().getTime(),
//   },
//   {
//     id: 3,
//     author: '이현지',
//     content: '하이 3',
//     emotion: 1,
//     created_date: new Date().getTime(),
//   },
// ];

function App() {
  // 일기데이터 배열 저장
  const [data, setData] = useState([]);

  const dataId = useRef(0);

  // API 호출
  const getData = async () => {
    const res = await fetch(
      'https://jsonplaceholder.typicode.com/comments'
    ).then((res) => res.json());

    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Math.floor(Math.random() * 5) + 1,
        created_date: new Date().getTime(),
        id: dataId.current++,
      };
    });

    setData(initData);
  };

  useEffect(() => {
    getData();
  }, []);

  // 새로운 일기를 추가하는 함수
  const onCreate = useCallback((author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id: dataId.current,
    };
    dataId.current += 1;
    setData((data) => [newItem, ...data]);
  }, []);

  // 일기 삭제
  const onRemove = useCallback((targetId) => {
    setData((data) => data.filter((it) => it.id !== targetId));
  }, []);

  // 수정완료 버튼
  const onEdit = useCallback((targetId, newContent) => {
    setData((data) =>
      data.map((it) =>
        it.id === targetId ? { ...it, content: newContent } : it
      )
    );
  }, []);

  // 더이상 함수가 아니다. 값으로 리턴을 해야 함
  const getDiaryAnalysis = useMemo(() => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return { goodCount, badCount, goodRatio };
  }, [data.length]);

  const { goodCount, badCount, goodRatio } = getDiaryAnalysis;

  return (
    <div className='App'>
      {/* <OptimizeTest /> */}
      {/* <Lifecycle /> */}
      <DiaryEditor onCreate={onCreate} />
      <div> 전체일기 : {data.length} </div>
      <div> 기분 좋은 일기 개수 : {goodCount}</div>
      <div> 기분 나쁜 일기 개수 : {badCount}</div>
      <div> 기분 좋은 일기 비율 : {goodRatio}</div>
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
}

export default App;
