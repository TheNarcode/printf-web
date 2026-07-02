'use client';
import { useState } from 'react';
import { getFCMToken } from '../../services/firebase';
import { requestNotificationPermission } from '../../services/notifications';

export default function TestFCM() {
  const [log, setLog] = useState<string[]>([]);
  const addLog = (msg: string) => setLog(prev => [...prev, msg]);

  const testFCM = async () => {
    try {
      addLog('Requesting notification permission...');
      const granted = await requestNotificationPermission();
      addLog(`Permission granted: ${granted}`);
      if (!granted) return;

      addLog('Getting FCM token...');
      const token = await getFCMToken();
      if (token) {
        addLog(`Got token: ${token.substring(0, 15)}...`);
      } else {
        addLog('Failed to get token (returned null). Check browser console for Firebase errors.');
      }
    } catch (e: any) {
      addLog(`Error: ${e.message}`);
    }
  };

  return (
    <div className="p-10 font-mono text-sm flex flex-col gap-4">
      <button onClick={testFCM} className="px-4 py-2 bg-blue-500 text-white rounded self-start">Test FCM</button>
      <div className="bg-gray-100 p-4 rounded min-h-[200px]">
        {log.map((l, i) => <div key={i}>{l}</div>)}
      </div>
    </div>
  );
}
