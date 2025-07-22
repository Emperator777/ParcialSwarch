'use client';

import { useState } from 'react';

type BalanceDisplayProps = {
  balance?: number;
  userId?: string;
  lastUpdated?: string;
  error?: string;
  isLoading?: boolean;
  onRefresh?: () => void;
};

export default function BalanceDisplay({
  balance,
  userId,
  lastUpdated,
  error,
  isLoading,
  onRefresh
}: BalanceDisplayProps) {
  return (
    <div className="w-[35%] mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Saldo Actual</h2>
      
      {isLoading && <p className="text-gray-600">Cargando...</p>}
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
          {onRefresh && (
            <button 
              onClick={onRefresh}
              className="ml-2 text-red-700 font-semibold hover:underline"
            >
              Reintentar
            </button>
          )}
        </div>
      )}
      
      {!userId && !isLoading && !error && (
        <p className="text-gray-600">Realice una transacción para ver el saldo</p>
      )}
      
      {userId && balance !== undefined && (
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="font-medium">ID Usuario:</span>
            <span>{userId}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Saldo Actual:</span>
            <span className={`text-2xl font-bold ${
              balance >= 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              ${balance.toFixed(2)}
            </span>
          </div>
          {lastUpdated && (
            <div className="text-sm text-gray-500 text-right">
              Actualizado: {new Date(lastUpdated).toLocaleString()}
            </div>
          )}
        </div>
      )}

      {onRefresh && (
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Actualizando...' : 'Actualizar Saldo'}
        </button>
      )}
    </div>
  );
}