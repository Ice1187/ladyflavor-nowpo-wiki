export const devNotes = [
/*
  {
    id: 1,
    date: '2025-03-21',
    tags: ['JavaScript', 'Promise'],
    title: '非同步處理筆記',
    summary: '處理 JavaScript 中的異步操作的最佳實踐',
    content: `# 非同步處理最佳實踐

## 使用 async/await
\`\`\`javascript
async function fetchData() {
  try {
    const response = await fetch('/api/data');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
}
\`\`\`

## 錯誤處理
- 使用 try/catch 捕獲錯誤
- 考慮加入重試機制
- 確保用戶收到適當的錯誤反饋

## Promise 鏈與異常處理
\`\`\`javascript
fetchData()
  .then(data => processData(data))
  .then(result => displayResult(result))
  .catch(error => handleError(error));
\`\`\`

## 並行請求
使用 \`Promise.all()\` 同時執行多個異步操作：

\`\`\`javascript
const [users, posts, comments] = await Promise.all([
  fetchUsers(),
  fetchPosts(),
  fetchComments()
]);
\`\`\`

處理多個請求，但不需要等待所有請求完成：

\`\`\`javascript
const promises = urls.map(url => fetch(url).catch(e => e));
const results = await Promise.allSettled(promises);
\`\`\``,
  },
  {
    id: 2,
    date: '2025-03-18',
    tags: ['React', '性能優化'],
    title: 'React Hooks 優化',
    summary: '使用 useMemo 和 useCallback 來優化渲染性能',
    content: `# React Hooks 性能優化技巧

## useMemo

\`useMemo\` 可以記憶計算結果，避免不必要的重新計算：

\`\`\`jsx
// 不好的寫法 - 每次渲染都會重新計算
const sortedItems = expensiveSort(items);

// 好的寫法 - 只在 items 改變時重新計算
const sortedItems = useMemo(() => {
  return expensiveSort(items);
}, [items]);
\`\`\`

## useCallback

\`useCallback\` 可以記憶函數引用，避免子組件不必要的重新渲染：

\`\`\`jsx
// 不好的寫法 - 每次都創建新的函數引用
const handleClick = () => {
  console.log('Clicked!', itemId);
};

// 好的寫法 - 只在 itemId 改變時創建新的函數引用
const handleClick = useCallback(() => {
  console.log('Clicked!', itemId);
}, [itemId]);
\`\`\`

## 減少不必要的狀態更新

確保狀態更新是必要的：

\`\`\`jsx
// 不好的寫法 - 總是更新狀態
function handleChange(newValue) {
  setValue(newValue);
}

// 好的寫法 - 只在值真正變化時更新狀態
function handleChange(newValue) {
  if (newValue !== value) {
    setValue(newValue);
  }
}
\`\`\`

## React.memo

使用 \`React.memo\` 避免組件的不必要重新渲染：

\`\`\`jsx
const MyComponent = React.memo(function MyComponent(props) {
  // 組件邏輯
});
\`\`\``,
  },
  {
    id: 3,
    date: '2025-03-12',
    tags: ['CSS', 'Tailwind', '響應式'],
    title: 'Tailwind 響應式設計',
    summary: '使用 Tailwind 的斷點前綴來創建響應式界面',
    content: `# Tailwind CSS 響應式設計指南

## 響應式斷點

Tailwind 提供了以下斷點前綴：

- \`sm:\` - 小屏幕 (640px 及以上)
- \`md:\` - 中等屏幕 (768px 及以上)
- \`lg:\` - 大屏幕 (1024px 及以上)
- \`xl:\` - 超大屏幕 (1280px 及以上)
- \`2xl:\` - 特大屏幕 (1536px 及以上)

## 示例

### 響應式布局

\`\`\`html
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  <!-- 內容 -->
</div>
\`\`\`

### 響應式字體大小

\`\`\`html
<h1 class="text-xl sm:text-2xl md:text-3xl lg:text-4xl">
  響應式標題
</h1>
\`\`\`

### 響應式可見性

\`\`\`html
<div class="hidden md:block">
  <!-- 在中等及更大的屏幕上顯示 -->
</div>
<div class="md:hidden">
  <!-- 在中等及更大的屏幕上隱藏 -->
</div>
\`\`\`

### 響應式間距

\`\`\`html
<div class="p-4 md:p-6 lg:p-8">
  <!-- 內容 -->
</div>
\`\`\`

## 最佳實踐

1. 使用移動優先的方法：默認為移動設計，然後使用斷點擴展到更大的屏幕
2. 避免過度使用斷點，保持設計的一致性
3. 使用 Tailwind 的自定義斷點來匹配您的設計要求`,
  }, */
  {
    id: 4,
    date: '2025-04-04',
    tags: ['資料清理'],
    title: 'Know Your Data: False Assumption on The Data Can Trip You',
    summary: '蒐集和清理 podcast 資料時的小趣事 (崩潰🫠)，與資深老粉才知道的 podcast 集數問題。',
    content: `# Know Your Data: False Assumption on The Data Can Trip You
這個專案中的 podcast 資料主要來自 SoundOn 跟 Spotify。由於資料格式比較混亂，而且重複爬取的機會不高（一週一集且需要的資料不多，暫時手動加即可），所以基本上是用 Python script 加工人智慧快速整理，再以集數排序一遍而已。

但在網頁都寫完了，最後人工 review 準備部署的時候才發現，集數跟標題竟然對不上！

> 如果猜得到問題出在哪的話，肯定是資深老粉 XD
> 
> 我已經重刷 7~8 次了，都沒特別注意到這個問題。

問題出在：
- 你知道 EP60 有兩集嗎？它們的集數是「EP60_1」和「EP60_2」。
- 你知道沒有 EP27 嗎？這集因為「用太輕鬆的口吻講鄰居弟弟故事」事件，阿斷在幫標題加註的時候不小心手殘誤刪。詳情可聽 EP28 開頭（ps：可以到 Timecode 頁面直接聽喔！）

最後把已經整理好的資料格式全部打掉，開獨立的 id 欄位，並把集數的型別從 Number 改成 String，網頁的 code 也是改了大半才處理好。**清理資料時，需要先檢查自己對資料的假設，驗證過後再開始寫應用，不然中途改資料格式真的超崩潰...。**

---- by 資深好味粉角 🧊
`,
  }
];
