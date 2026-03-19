import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Lock } from 'lucide-react';

const OWNER_USERNAME = 'Ayaali';
const OWNER_PASSWORD = 'aya1234';

export default function OwnerLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === OWNER_USERNAME && password === OWNER_PASSWORD) {
      localStorage.setItem('ownerLoggedIn', 'true');
      localStorage.setItem('ownerUsername', username);
      setLocation('/');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-2xl">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-indigo-100 p-4 rounded-full">
              <Lock className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Nawwar Journey</h1>
          <p className="text-gray-600 mb-4 text-lg">رحلة نوّار</p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-3"><strong>Platform Features:</strong></p>
            <ul className="text-xs text-gray-600 space-y-1 text-left">
              <li>✓ Interactive Educational Games</li>
              <li>✓ QR Code Generator</li>
              <li>✓ Illustrated Stories</li>
              <li>✓ ASL Applications</li>
            </ul>
            <p className="text-xs text-gray-700 mt-3 pt-3 border-t border-blue-200">
              <strong>للاشتراك تواصل مع إدارة نوار جيرني</strong>
            </p>
            <a
              href="https://wa.me/971542897175?text=Hello%20Nawwar%20Journey%20Admin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-green-600 hover:text-green-700 font-semibold text-xs"
            >
              📱 WhatsApp: +971 54 289 7175
            </a>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username | اسم المستخدم
            </label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              className="w-full"
              autoComplete="username"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password | كلمة المرور
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full"
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded text-sm">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2"
          >
            Login | دخول
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500 text-center">
            Authorized users only | المستخدمون المصرح لهم فقط
          </p>
        </div>
      </Card>
    </div>
  );
}
