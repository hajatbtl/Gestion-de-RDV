
import './App.css';

import React, { useState, useEffect } from 'react';
import { CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Layout, Input, theme, Radio, Modal, DatePicker, Result, Calendar } from 'antd';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import { gapi } from 'gapi-script';
import Client from './pages/Client';
import Admin from './pages/Admin';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';


function App() {


  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Client />} ></Route>
        <Route path="/admin" element={(<Admin />)} ></Route>

      </Routes >
    </BrowserRouter >

  );
}

export default App;
