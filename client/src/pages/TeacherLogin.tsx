import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { trpc } from '@/lib/trpc';

export default function TeacherLogin() {
  const [schoolName, setSchoolName] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState('');
  const [, setLocation] = useLocation();

  const loginMutation = trpc.teacher.login.useMutation();
  const registerMutation = trpc.teacher.register.useMutation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!schoolName.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    try {
      if (isRegister) {
        const result = await registerMutation.mutateAsync({ schoolName, password });
        if (result.success) {
          setError('');
          setIsRegister(false);
          setSchoolName('');
          setPassword('');
        } else {
          setError(result.message || 'Registration failed');
        }
      } else {
        const result = await loginMutation.mutateAsync({ schoolName, password });
        if (result.success) {
          localStorage.setItem('teacherId', (result.id || '').toString());
          localStorage.setItem('schoolName', result.schoolName || '');
          setLocation('/');
        } else {
          setError(result.message || 'Login failed');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Nawwar Journey</h1>
          <p className="text-gray-600">نوّار جيرني</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              School Name | اسم المدرسة
            </label>
            <Input
              type="text"
              value={schoolName}
              onChange={(e) => setSchoolName(e.target.value)}
              placeholder="Enter school name"
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password | كلمة السر
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full"
            />
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2"
            disabled={loginMutation.isPending || registerMutation.isPending}
          >
            {isRegister ? 'Register | تسجيل' : 'Login | دخول'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
            className="text-indigo-600 hover:text-indigo-700 font-medium"
          >
            {isRegister
              ? 'Already have an account? Login'
              : "Don't have an account? Register"}
          </button>
        </div>
      </Card>
    </div>
  );
}
