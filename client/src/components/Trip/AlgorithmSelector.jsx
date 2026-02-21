import React, { useState, useContext } from 'react';
import { TripContext } from '../../context/TripContext';
import axios from 'axios';
import { IoPlayOutline, IoTimeOutline, IoFootstepsOutline, IoSpeedometerOutline } from 'react-icons/io5';

const AlgorithmSelector = () => {
    const { selectedCities, setVisualizedRoute, setAlgorithmMetrics } = useContext(TripContext);
    const [algorithm, setAlgorithm] = useState('dijkstra');
    const [isCalculating, setIsCalculating] = useState(false);
    const [localMetrics, setLocalMetrics] = useState(null);

    const handleShowRoute = async () => {
        if (!selectedCities || selectedCities.length < 2) return;

        setIsCalculating(true);
        setLocalMetrics(null);
        setVisualizedRoute(null); // Clear previous visual route

        try {
            const response = await axios.post('http://localhost:5000/api/algorithms/run', {
                cities: selectedCities,
                algorithm: algorithm
            });

            setVisualizedRoute(response.data.route);
            const metrics = {
                distance: response.data.totalDistance,
                nodes: response.data.visitedNodes,
                time: response.data.executionTimeMs
            };
            setLocalMetrics(metrics);
            setAlgorithmMetrics(metrics);

        } catch (error) {
            console.error('Failed to run algorithm', error);
            alert('Algorithm execution failed.');
        } finally {
            setIsCalculating(false);
        }
    };

    return (
        <div className="bg-white p-5 rounded-xl text-sm border-t border-gray-100 flex flex-col space-y-4 shadow-sm mt-4">
            <h2 className="font-bold text-gray-800 text-lg">Algorithm Visualizer</h2>

            <div className="flex flex-col space-y-2">
                <label className="text-gray-600 font-semibold text-xs uppercase tracking-wide">Select Algorithm</label>
                <div className="relative">
                    <select
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value)}
                        disabled={isCalculating || selectedCities.length < 2}
                        className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 block p-3 appearance-none font-medium disabled:opacity-50 transition-shadow"
                    >
                        <option value="dijkstra">Dijkstra's Algorithm</option>
                        <option value="bfs">Breadth-First Search (BFS)</option>
                        <option value="dfs">Depth-First Search (DFS)</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                    </div>
                </div>
            </div>

            <button
                onClick={handleShowRoute}
                disabled={selectedCities.length < 2 || isCalculating}
                className="w-full flex items-center justify-center p-3 rounded-lg font-bold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md bg-blue-600 hover:bg-blue-700 active:scale-[98%]"
            >
                {isCalculating ? (
                    <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Calculating...</span>
                    </div>
                ) : (
                    <div className="flex items-center space-x-2">
                        <IoPlayOutline className="text-lg" />
                        <span>Show Route</span>
                    </div>
                )}
            </button>

            {/* Metrics Panel */}
            {localMetrics && (
                <div className="mt-4 bg-blue-50/50 rounded-xl p-4 border border-blue-100 flex flex-col space-y-3">
                    <div className="text-sm font-bold text-blue-900 border-b border-blue-100 pb-2">Visualization Metrics</div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-3 rounded-lg flex items-center space-x-3 shadow-sm border border-blue-50">
                            <IoTimeOutline className="text-xl text-amber-500" />
                            <div>
                                <div className="text-xs text-gray-500 font-medium">Time Taken</div>
                                <div className="font-bold text-gray-800">{localMetrics.time} ms</div>
                            </div>
                        </div>
                        <div className="bg-white p-3 rounded-lg flex items-center space-x-3 shadow-sm border border-blue-50">
                            <IoFootstepsOutline className="text-xl text-green-500" />
                            <div>
                                <div className="text-xs text-gray-500 font-medium">Nodes Visited</div>
                                <div className="font-bold text-gray-800">{localMetrics.nodes}</div>
                            </div>
                        </div>
                        <div className="col-span-2 bg-white p-3 rounded-lg flex items-center space-x-3 shadow-sm border border-blue-50">
                            <IoSpeedometerOutline className="text-xl text-purple-500" />
                            <div>
                                <div className="text-xs text-gray-500 font-medium">Total Distance</div>
                                <div className="font-bold text-gray-800">{localMetrics.distance} km</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AlgorithmSelector;
