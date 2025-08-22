import { request } from '@/api/base.api';
import StatCard from '@/components/stat-card';
import { useEffect, useState } from 'react';
import { StatTitleMap } from '@/lib/constants';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { MainLoader } from '@/components/main-loader';
import EndpointList from '@/components/endpoint-list';

interface StatCardData {
  title: string;
  description: string;
  value: string;
  unit: string;
  type: string;
}

type StatKey = keyof typeof StatTitleMap;

export function HomePage() {
  const params = new URLSearchParams(window.location.search);

  const [statCards, setStatCards] = useState<StatCardData[]>([]);
  const [timeRange, setTimeRange] = useState<string>(params.get('days') || '1');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [endpoints, setEndpoints] = useState([]);

  const statRequest = request();
  const endpointsRequest = request();

  async function init() {
    setLoading((prev) => !prev);
    const cards: StatCardData[] = [];
    // Add type annotation for API response
    try {
      const promises = [
        statRequest.get({
          method: 'getStats', 
          days: timeRange
        }),
        endpointsRequest.get({
          method: 'getEndpoints'
        })];
      const [{data}, {data : endpointsResp}] = await Promise.all(promises);
      for (const key in data) {
        // Ensure key exists in StatTitleMap
        if (key in StatTitleMap) {
          const statKey = key as StatKey;

          const title = StatTitleMap[statKey].title;
          let description = '';
          let value = data[statKey] || '';
          let unit = StatTitleMap[statKey].unit;
          let type = StatTitleMap[statKey].type;

          if (statKey === 'fastestEndpoint' || statKey === 'slowestEndpoint') {
            if (typeof data[statKey] === 'object' && data[statKey] !== null) {
              description = `Average latency is ${(data[statKey] as { averageLatency: number }).averageLatency} ms`;
              value = (data[statKey] as { endpoint: string }).endpoint;
            }
          }
          if(statKey == 'highestTraffic'){
            if(typeof data[statKey] === 'object' && data[statKey] !== null){
              description = `Number of requests is ${(data[statKey] as {count: number}).count}`;
              value = (data[statKey] as { endpoint: string }).endpoint;
            }
          }
          cards.push({
            title,
            description,
            value,
            unit,
            type
          });
        }
      }
      setStatCards(cards);  
      setLoading(false);
      setEndpoints(endpointsResp);
    } catch (err) {
      setError('Error connecting to server!');
      setLoading(false);
    }
  }

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set('days', timeRange);
    window.history.replaceState({}, '', url); 
    init();
  }, [timeRange]);

  if (error) {
    return (
      <div>
        <h3>{error}</h3>
      </div>
    )
  }

  if (loading) {
    return (
      <MainLoader />
    )
  }

  return (
    <div>
      <div className='mb-6'>
        <Select defaultValue={timeRange} onValueChange={(value) => setTimeRange(value)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Time Range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">Last day</SelectItem>
            <SelectItem value="3">Last 3 days</SelectItem>
            <SelectItem value="7">Last week</SelectItem>
            <SelectItem value="30">Last month</SelectItem>
            <SelectItem value="90">Last 3 months</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {statCards.map((c) => (
          <StatCard
            title={c.title}
            description={c.description}
            value={c.value}
            key={c.value}
            type={c.type}
            unit={c.unit}
          />
        ))}
      </div>
      <div className='py-4'>
        <h2 className='text-2xl font-semibold mt-3 mb-4'>Endpoint List</h2>
        <EndpointList endpoints={endpoints} />
      </div>
    </div>
  );
}