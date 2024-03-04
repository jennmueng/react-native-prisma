import '@op-engineering/react-native-prisma';
import React, { useEffect, useState } from 'react';
import {
  Clipboard,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Button } from './Button';
import { NetworkInfo } from 'react-native-network-info';
import { atob, btoa } from 'react-native-quick-base64';
import 'react-native-url-polyfill/auto';
import '../global.css';
import {
  createPost,
  createRandomUser,
  queryAllPosts,
  queryAllUsers,
} from './db';
import './server';

// global.TextEncoder = require('text-encoding').TextEncoder;
global.atob = atob;
global.btoa = btoa;

export default function App() {
  const [engineResponse, setEngineResponse] = useState<any>('');
  const [prismaTime, setPrismaTime] = useState(0);
  const [IP, setIP] = useState<string>('');

  useEffect(() => {
    NetworkInfo.getIPAddress().then((ip) => {
      setIP(`${ip}:3000`);
    });
  }, []);

  const createUser = async () => {
    let start = performance.now();

    await createRandomUser();

    let end = performance.now();
    setPrismaTime(end - start);
  };

  const queryUsers = async () => {
    let start = performance.now();

    const res = await queryAllUsers();

    let end = performance.now();
    setEngineResponse(res);
    setPrismaTime(end - start);
  };

  const createPostCb = async () => {
    const res = await createPost();
    setEngineResponse(res);
  };

  const queryAllPostsCb = async () => {
    const res = await queryAllPosts();
    setEngineResponse(res);
  };

  const copyIP = () => {
    Clipboard.setString(IP);
    console.warn('IP copied to clipboard');
  };

  return (
    <SafeAreaView className="flex-1 bg-prisma">
      <ScrollView contentContainerClassName="p-4 gap-4">
        <Text className="text-white font-semibold text-lg">▲ Prisma</Text>
        <TouchableOpacity onPress={copyIP}>
          <View className="justify-between flex-row bg-[#58A6FF55] p-4 border border-[#58A6FF] rounded-lg">
            <Text className="text-white">HTTP Server IP:</Text>
            <Text className="text-white font-semibold">{IP}</Text>
          </View>
        </TouchableOpacity>
        <View className="flex-row justify-between">
          <Text className="text-white font-semibold text-lg">
            Engine Response
          </Text>
          <Text className="text-white">{prismaTime.toFixed(0)}ms</Text>
        </View>
        <Text className="text-white bg-neutral-800 border rounded-lg p-4 border-neutral-700">
          {JSON.stringify(engineResponse, null, 4)}
        </Text>
      </ScrollView>
      <Button title="Create user" callback={createUser} />
      <Button title="Create post" callback={createPostCb} />
      <Button title="Get users" callback={queryUsers} />
      <Button title="Get posts" callback={queryAllPostsCb} />
    </SafeAreaView>
  );
}