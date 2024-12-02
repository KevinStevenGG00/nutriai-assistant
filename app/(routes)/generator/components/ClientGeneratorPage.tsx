"use client";

import React, { useState } from "react";
import * as mobilenet from "@tensorflow-models/mobilenet";
import "@tensorflow/tfjs";

interface NutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fiber: number;
}

export default function GeneratorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [nutritionalInfo, setNutritionalInfo] =
    useState<NutritionalInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(false); // Indicador de carga

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setResult(null); // Reiniciar el resultado al cargar una nueva imagen
        setNutritionalInfo(null); // Reiniciar la información nutricional
      };
      reader.readAsDataURL(file);
    }
  };

  const classifyImage = async () => {
    if (!image) return;

    setLoading(true); // Activar indicador de carga
    const imgElement = document.getElementById(
      "uploaded-image"
    ) as HTMLImageElement;
    const model = await mobilenet.load();
    const predictions = await model.classify(imgElement);

    // Mostrar el resultado principal
    if (predictions && predictions.length > 0) {
      const bestMatch = normalizeFoodName(predictions[0].className);
      setResult(bestMatch); // Mostrar el nombre genérico (por ejemplo, 'apple')

      // Buscar información nutricional
      const nutritionalData = getNutritionalInfo(bestMatch);
      setNutritionalInfo(nutritionalData);
    }
    setLoading(false); // Desactivar indicador de carga
  };

  const normalizeFoodName = (food: string) => {
    const mappings: Record<string, string> = {
      "granny smith": "apple",
      // Añade más mapeos si es necesario
    };
    return mappings[food.toLowerCase()] || food.toLowerCase();
  };

  const getNutritionalInfo = (food: string): NutritionalInfo | null => {
    const database: Record<string, NutritionalInfo> = {
      apple: { calories: 52, protein: 0.3, carbs: 14, fiber: 2.4 },
      banana: { calories: 89, protein: 1.1, carbs: 23, fiber: 2.6 },
      orange: { calories: 47, protein: 0.9, carbs: 12, fiber: 2.4 },
      strawberry: { calories: 32, protein: 0.67, carbs: 7.7, fiber: 2 },
      "pineapple, ananas": {
        calories: 50,
        protein: 0.54,
        carbs: 13.1,
        fiber: 1.4,
      },
    };

    return database[food.toLowerCase()] || null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 py-4 px-4">
      <div className="bg-white shadow-md rounded-lg p-5 w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Escaneo de Alimentos
        </h1>
        <div className="mb-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>
        {image && (
          <div className="mb-4 flex justify-center">
            <img
              id="uploaded-image"
              src={image}
              alt="Uploaded"
              className="w-full max-w-xs rounded-lg shadow-sm"
            />
          </div>
        )}
        <button
          onClick={classifyImage}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg font-medium text-lg hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300 transition duration-300"
          disabled={loading}
        >
          {loading ? "Analizando..." : "Analizar Imagen"}
        </button>
        {result && (
          <div className="mt-6 text-center">
            <h2 className="text-xl font-semibold text-gray-700">
              Resultado: <span className="text-blue-600">{result}</span>
            </h2>
            {nutritionalInfo ? (
              <div className="mt-4 text-left bg-gray-50 p-4 rounded-lg shadow-inner">
                <p>
                  <span className="font-semibold">Calorías:</span>{" "}
                  {nutritionalInfo.calories} kcal
                </p>
                <p>
                  <span className="font-semibold">Proteínas:</span>{" "}
                  {nutritionalInfo.protein} g
                </p>
                <p>
                  <span className="font-semibold">Carbohidratos:</span>{" "}
                  {nutritionalInfo.carbs} g
                </p>
                <p>
                  <span className="font-semibold">Fibra:</span>{" "}
                  {nutritionalInfo.fiber} g
                </p>
              </div>
            ) : (
              <p className="mt-4 text-red-600">
                No hay información nutricional disponible.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
