import React, { useState } from 'react';

const PeeAwardPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentTimecode, setCurrentTimecode] = useState(null);
  const baseEmbedUrl = "https://open.spotify.com/embed/episode/4IrpnP9z83KIYy1FQVz4SV";  // EP142

  const getEmbedUrl = (timecode = null) => {
    if (!timecode) return `${baseEmbedUrl}?utm_source=generator`;
    const [minutes, seconds] = timecode.split(':').map(Number);
    const totalSeconds = minutes * 60 + seconds;
    return `${baseEmbedUrl}?utm_source=generator&t=${totalSeconds}`;
  };

  const handleTimecodeClick = (timecode) => {
    setCurrentTimecode(timecode);
    setIsLoaded(false);
  };

  const TimecodeButton = ({ timecode }) => (
    <button
      className="text-secondary hover:text-secondary-dark hover:underline focus:outline-none transition-colors duration-200"
      onClick={() => handleTimecodeClick(timecode)}
      aria-label={`跳轉至 ${timecode}`}
    >
      {timecode}
    </button>
  );

  // Award data
  const awards = [
    {
      id: 1,
      award: "最佳研畢獎",
      nominees: "貓吊床最適合春天了",
      winner: "貓吊床最適合春天了",
      theme: "謝謝我家貓貓與好味的陪伴",
      timecode: "10:24"
    },
    {
      id: 2,
      award: "蟲蟲危機獎",
      nominees: "醃蘿蔔好吃",
      winner: "醃蘿蔔好吃",
      theme: "小黑蚊好可怕",
      timecode: "12:33"
    },
    {
      id: 3,
      award: "最佳生日獎",
      nominees: "晛唸彥不是見也不是現",
      winner: "晛唸彥不是見也不是現",
      theme: "為何要去喜歡轉瞬即逝的東西呢",
      timecode: "15:16"
    },
    {
      id: 4,
      award: "消化系統獎",
      nominees: "Woodstock0065、熱愛水獺與薯條的白蛇",
      winner: "Woodstock0065",
      theme: "青春與大便的故事",
      timecode: "18:34"
    },
    {
      id: 5,
      award: "最佳小說獎",
      nominees: "草魚QAQ、許太陽 Sunny Hsu",
      winner: "草魚QAQ",
      theme: "來回踱步的草魚QAQ",
      timecode: "23:19"
    },
    {
      id: 6,
      award: "最長 (ㄓㄤˇ) 智慧獎",
      nominees: "我的智齒是躺的！！",
      winner: "我的智齒是躺的！！",
      theme: "拔智齒好痛",
      timecode: "31:50"
    },
    {
      id: 7,
      award: "最佳脆脆猜錯獎",
      nominees: "神寵愛的孩子、Pppppppppeng",
      winner: "神寵愛的孩子",
      theme: "忐忑",
      timecode: "34:25"
    },
    {
      id: 8,
      award: "脆脆哼哼金曲獎",
      nominees: "脆脆",
      winner: "脆脆",
      theme: "EP120 灌籃高手 mix 福音戰士",
      timecode: "39:50"
    },
    {
      id: 9,
      award: "年度笑話獎",
      nominees: "Huang Yi-Pin、家有四貓很幸福、Omgoddddddd、Curtis4X、Bubu",
      winner: "Huang Yi-Pin",
      theme: "人頭落地（出人頭地）",
      timecode: "42:53",
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto p-2 sm:p-4 h-full overflow-y-auto">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-secondary-dark">2022 第一屆小解獎 (EP142)</h2>

        {/* Spotify Player */}
        <div className={`transition-all duration-500 mb-3 sm:mb-4 ${isLoaded ? '' : 'opacity-50 blur-sm'}`}>
          <iframe
            src={getEmbedUrl(currentTimecode)}
            className="rounded-xl w-full px-0 sm:px-2"
            height="152"
            frameBorder="0"
            allowFullScreen=""
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            onLoad={() => setIsLoaded(true)}
          ></iframe>
        </div>

        {/* Description */}
        <div className="bg-secondary-light/20 p-3 sm:p-4 rounded-lg mb-4 sm:mb-6 text-gray-700 text-sm sm:text-base">
          <p className="mb-2">「小」是好味小姐的<strong>小</strong>，「解」是解開束縛的<strong>解</strong>。小小解放自己心情的小天地，完全沒有也不可能有其他意思。</p>
          <p>評選原則：緣分</p>
        </div>

        {/* Desktop Table View (hidden on mobile) */}
        <div className="hidden md:block overflow-hidden rounded-lg shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  獎項
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  入圍者
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  得獎者
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  得獎主題
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  得獎 Timecode
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {awards.map(award => (
                <tr key={award.id} className="hover:bg-gray-50">
                  <td className="px-3 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                    {award.award}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500">
                    {award.nominees}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500">
                    {award.winner}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500">
                    {award.theme}
                  </td>
                  <td className="px-3 py-3 text-sm text-gray-500">
                    <TimecodeButton timecode={award.timecode} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View (visible only on mobile) */}
        <div className="md:hidden space-y-4">
          {awards.map(award => (
            <div key={award.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="bg-primary px-4 py-3">
                <h3 className="font-medium text-gray-900">
                  {award.award}
                </h3>
              </div>
              <div className="px-4 py-3 space-y-2">
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-xs font-medium text-gray-500">入圍者</div>
                  <div className="text-sm text-gray-900 col-span-2">{award.nominees}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-xs font-medium text-gray-500">得獎者</div>
                  <div className="text-sm text-gray-900 col-span-2">{award.winner}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-xs font-medium text-gray-500">得獎主題</div>
                  <div className="text-sm text-gray-900 col-span-2">{award.theme}</div>
                </div>
                <div className="grid grid-cols-3 gap-1">
                  <div className="text-xs font-medium text-gray-500">Timecode</div>
                  <div className="text-sm text-gray-900 col-span-2">
                    <TimecodeButton timecode={award.timecode} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PeeAwardPage;
