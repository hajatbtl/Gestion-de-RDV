
import './App.css';
import React, { useState, useEffect } from 'react';
import { CalendarOutlined } from '@ant-design/icons';
import { Layout, Input, Calendar, theme, Radio, Modal } from 'antd';
import { Button, Card, Col, Container, Form, Row, FloatingLabel } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import { gapi } from 'gapi-script';

const { Header, Sider, Content } = Layout;
const onPanelChange = (value, mode) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};
const { TextArea } = Input;
function App() {

  const { token } = theme.useToken();
  const [value, setValue] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [data, setData] = useState({});
  const [open, setOpen] = useState(false);
  const [refreshToken, setRefreshToken] = useState(null);
  const calendarID = '1f480b29afce3df3b4d365a3396bfa1dc2e086de66af2ac395b8c1d8fa96daae@group.calendar.google.com';
  const apiKey = 'process.env.REACT_APP_GOOGLE_API_KEY';

  const wrapperStyle = {
    width: 300,
    border: `1px solid ${token.colorBorderSecondary}`,
    borderRadius: token.borderRadiusLG,
  };
  const onChange = (e) => {
    console.log('radio checked', e.target.value);
    setValue(e.target.value);
  };

  useEffect(() => {
    getAccessTokenWithRefreshToken()
  }, [])

  const handleTokenExchange = async () => {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: new URLSearchParams({
        code: '4/0AVHEtk6u04Nlpz8aZhl2cZVbWsQqZEDCWUEwtsHjWDqQPAWCYsvCKmHgQVEiUv_N0tMvew',
        client_id: '542993706002-9q5e9p1i0dg1guo8sgppslqcib6jlssi.apps.googleusercontent.com',
        client_secret: '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',
        redirect_uri: 'http://localhost:3000',
        grant_type: 'authorization_code'
      })
    });
    const data = await response.json();
    if (data)
      setRefreshToken(data.refresh_token)
  };

  const getAccessTokenWithRefreshToken = async () => {

    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: '542993706002-9q5e9p1i0dg1guo8sgppslqcib6jlssi.apps.googleusercontent.com',
        client_secret: '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',
        refresh_token: '1//03hCKFISd-Va2CgYIARAAGAMSNwF-L9IrzXa5ITl-kYsoI_kmFl3DIKkXdlIpKKCclRuizHxYTz3YNOYvfcKmOtuviHQumf2u8Sg',
        grant_type: 'refresh_token',
      }).toString(),
    });

    if (response.ok) {
      const { access_token } = await response.json();
      console.log(access_token)
      setRefreshToken(access_token)
    } else {
      console.error('Error getting access token with refresh token:', response);
    }
  };

  const addEvent = (event) => {
    function initiate() {
      gapi.client
        .request({
          path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events?sendUpdates=all&conferenceDataVersion=1`,
          method: "POST",
          body: event,
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        })
        .then(
          (response) => {
            return [true, response];
          },
          function (err) {
            console.log(err);
            return [false, err];
          }
        );
    }
    gapi.load("client", initiate);
  };

  const handleSelectChange = (event) => {
    const { value } = event.target;
    setData({ ...data, objet: value })
    setIsVisible(value === 'autre');
  };

  const disabledDate = (current) => {
    return current && current < dayjs().endOf('day');
  }

  useEffect(() => {
    console.log(data)
  }, [data])
  return (
    <Layout>
      <Layout className="site-layout bg-light">
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            borderRadius: 20,
            background: '#fff',
          }}>
          <Container className="p-lg-5 p-0 shadow-lg p-3 mb-5 bg-white rounded ">
            <div className="page-header-content p-xl-4 p-md-0">
              <Row className='align-items-center justify-content-between'>
                <div className="col-auto">
                  <h1 className="fs-3 align-items-center d-flex">
                    <CalendarOutlined className='me-3 fs-2 mt-1' />
                    Prenez un rendez-vous
                  </h1>

                </div>

              </Row>
            </div>
            <Row className="mt-5">
              <Col xl='5'>
                <div className='d-flex gap-3 justify-content-between'>
                  <p>Nom et Prénom:</p>
                  <div>
                    <Input onChange={(v) => setData({ ...data, nom: v.currentTarget.value })} placeholder="Nom et prénom" />
                  </div>
                </div>
                <div className='d-flex gap-3 justify-content-between'>
                  <p>Numéro de téléphone</p>
                  <div>
                    <Input value={data?.tel} onChange={(e) => {
                      const numericValue = e.target.value.replace(/[^0-9]/g, '');
                      setData({ ...data, tel: numericValue });
                    }} placeholder="+33" />
                  </div>
                </div>
                <div className='d-flex gap-3 justify-content-between'>
                  <p>Mail</p>
                  <div>
                    <Input onChange={(v) => setData({ ...data, mail: v.currentTarget.value })} placeholder="Entrer votre mail" />
                  </div>
                </div>
                <div className='d-flex gap-3 justify-content-between'>
                  <p>Objet</p>
                  <div>
                    <Form.Select onChange={handleSelectChange} style={{ maxWidth: 190 }} aria-label="Default select example" size="sm">
                      <option value="Instalation">Instalation</option>
                      <option value="Revue des instalations">Revue des instalations</option>
                      <option value="Demande d'information">Demande d'information</option>
                      <option value="Besoin d'aide">Besoin d'aide</option>
                      <option value="autre">Autre</option>
                    </Form.Select>
                  </div>
                </div>
                {isVisible && (
                  <TextArea rows={7} onChange={(v) => setData({ ...data, objet: v.currentTarget.value })} />)}

              </Col>
              <Col xl='7 ' className='text-right '>
                <div  >
                  <Calendar disabledDate={disabledDate} onChange={(v) => setData({ ...data, date: dayjs(v).format('YYYY-MM-DD') })} className='fs-6' fullscreen={false} onPanelChange={onPanelChange} />
                </div>
              </Col>
            
            </Row>
            <Row className='mt-5'>  
            <Col xl='' className='text-center'>
                <div className='d-flex gap-5 align-items-center'>
                  <div>
                    <p>Choisisez-vous l'heure</p>
                  </div>
                  <Radio.Group onChange={onChange} value={value}>

                    <Radio.Group onChange={(v) => setData({ ...data, heure: v.target.value })} defaultValue="a" size="large">
                      <div className=''>
                        <div>
                          <Radio.Button  className='rounded' value="09">09:00</Radio.Button> &npsp;
                          <Radio.Button className='mt-3 rounded' value="10">10:00</Radio.Button>&npsp;
                          <Radio.Button className='mt-3 rounded' value="11">11:00</Radio.Button>&npsp;
                          <Radio.Button className='mt-3 rounded' value="12">12:00</Radio.Button>&npsp;
                        </div>
                        <div>
                          <Radio.Button className='rounded' value="13">13:00</Radio.Button>&npsp;
                          <Radio.Button className='mt-3 rounded' value="14">14:00</Radio.Button>&npsp;
                          <Radio.Button className='mt-3 rounded' value="15">15:00</Radio.Button>&npsp;
                          <Radio.Button className='mt-3 rounded' value="16">16:00</Radio.Button>&npsp;
                        </div>
                      </div>
                    </Radio.Group>
                  </Radio.Group>
                </div>

                <div className=' mt-5 d-flex gap-5 align-items-baseline'>
                  <p>La durée de réunion</p>
                  <div className='ms-3'>
                    <Form.Select onChange={(v) => setData({ ...data, duree: v.target.value })} size="sm">
                      <option value="15"> 15 min </option>
                      <option value="30"> 30 min </option>
                      <option value="45"> 45 min </option>
                      <option value="59"> 59 min </option>
                    </Form.Select>
                  </div>
                </div>

              </Col>
              <Col> </Col>
              </Row>
            <Row className='mt-5'>
              <Col className='text-right ml'>
                <Button onClick={() => setOpen(true)} variant='outline-primary ' size='sm' className='rounded m-2 ms-auto d-block'>
                  Enregistrer le rendez-vous
                </Button>
              </Col>
            </Row>


            <Modal footer={[
              <Button onClick={() => setOpen(false)} variant='outline-primary ' size='sm' className='rounded m-2' key="back" >
                Annuler
              </Button>,
              <Button variant='outline-primary ' size='sm' className='rounded m-2' key="submit" onClick={() => addEvent({
                summary: "RDV client Objet : "+ data.objet +" Notez-Nous",
                location: "",
                start: {
                  dateTime: data.date + "T" + data.heure + ":00:00",
                  timeZone: "Europe/Paris",
                },
                end: {
                  dateTime: data.date + "T" + data.heure + ":" + data.duree + ":00",
                  timeZone: "Europe/Paris",
                },
                recurrence: ["RRULE:FREQ=DAILY;COUNT=1"],
                attendees: [
                  { email: data.mail }, { email: 'hajarboutuil222@gmail.com' }

                ],
                sendUpdates: "all",
                conferenceData: {
                  createRequest: { requestId: "7qxalsvy0e" }
                }
                // description: `Join Google Meet: fdsfsdfdfsdfsdfdsf`
              })} >
                Confirmer
              </Button>,
            ]} title="Confirmation de rendez-vous" centered open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)} width={1000}  >
              <div >
                <hr></hr>
                <p>Cher(e) {data.nom} <br></br> Nous sommes ravis de vous confirmer votre rendez-vous prévu le <strong>{data.date}</strong> à <strong> {data.heure + ':00'}</strong> - <strong> {data.heure + ':' + data.duree}</strong>.<br></br>
                  Nous sommes prêts à vous recevoir et à vous fournir le service attendu pour <span style={{ color: '#1677ff' }}> "{data.objet}"</span> .</p>
                Cliquez sur le bouton confirmer pour confirmer votre rendez-vous.
              </div>
            </Modal>
          </Container>

        </Content>
      </Layout>
    </Layout>
  );
}

export default App;
