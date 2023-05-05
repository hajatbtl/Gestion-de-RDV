

import React, { useState, useEffect } from 'react';
import { CalendarOutlined, InfoCircleOutlined } from '@ant-design/icons';
import { Layout, Input, theme, Radio, Modal, DatePicker, Result, Calendar } from 'antd';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import { gapi } from 'gapi-script';


import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);
const { RangePicker } = DatePicker;
const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};
const disabledDateTime = () => ({
  disabledHours: () => range(0, 24).splice(4, 20),
  disabledMinutes: () => range(30, 60),

});
const { Header, Sider, Content } = Layout;
const onPanelChange = (value, mode) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};
const { TextArea } = Input;

const Client = () => {

  const { token } = theme.useToken();
  const [value, setValue] = useState(1);
  const [isVisible, setIsVisible] = useState(false);
  const [visibledate, setVisibledate] = useState(false);

  const [data, setData] = useState({
    objet: 'installation',
    duree: 15
  });
  const [errors, setErrors] = useState({
    nom: true
  });
  const [open, setOpen] = useState(false);
  const [refreshToken, setRefreshToken] = useState(null);
  const calendarID = '1f480b29afce3df3b4d365a3396bfa1dc2e086de66af2ac395b8c1d8fa96daae@group.calendar.google.com';
  const apiKey = 'process.env.REACT_APP_GOOGLE_API_KEY';
  const [isSent, setIsSent] = useState(false);
  const appointmentDate = new Date('2023-05-01T10:00:00Z');
  const [reserved, setReserved] = useState([]);
  const [disabledHours, setDisabledHours] = useState({});

  // const [disabledHours, setDisabledHours] = useState({});



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


  const checkIfHasRdv = (e) => {

    fetch('http://localhost:2000/api/clients/email/' + e)
      .then(response => response.json())
      .then(response => {
        if (response.length > 0) {
          Modal.error({
            title: 'Vous avez déja un rendez-vous',
            content: 'Vous avez déja un rendez-vous le ' + response[0].date + ' vous ne pouvez pas donc prendre un autre',
          });
        }
      })
      .catch(error => console.error(error));

  }

  const fetchEvents = async (access_token) => {
    try {
      // Fetch events from the Google Calendar API
      const response = await fetch(
        'https://www.googleapis.com/calendar/v3/calendars/' + calendarID + '/events',
        {
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${access_token}`,
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setReserved(data.items)
      } else {
        console.error('Error fetching events:', response);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

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
      fetchEvents(access_token)
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
            console.log(response)
            if (response.status) {
              setIsSent(true)
              fetch('http://localhost:2000/api/clients/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(
                  {
                    "nom_prenom": data.nom,
                    "email": data.mail,
                    "tel": data.tel,
                    "etablissement": data.etablissement,
                    "objet": data.objet,
                    "date": data.date,
                    "heure": data.heure,
                    "duree": data.duree,
                    "id_event": response?.result?.id
                  }
                )
              })
                .then(response => response.json())
                .then(data => console.log(data));
            } else {
              Modal.error({
                title: 'Erreur',
                content: 'Impossible de prenez le rendez-vous en ligne. Merci de nous contacter par email (direction@noteznous.fr)',
              });
            }
            setOpen(false)
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
  const handleChangeduree = (event) => {
    const selectedValue = event.target.value;
    setVisibledate(selectedValue === "30" || "15" || "45" || "59");
  };


  const disabledDate = (current) => {
    return current && (current < dayjs().endOf('day') || current.day() === 0 || current.day() === 6);
  }


  const verifyReserved = () => {
    setDisabledHours({

    })
    let selectedDate = dayjs(data.date).format('YYYY-MM-DD');
    reserved.map((event) => {
      if (dayjs(event.start.dateTime).format('YYYY-MM-DD') == selectedDate) {
        let fromHour = dayjs(event.start.dateTime).format('HH:mm');
        let toHour = dayjs(event.end.dateTime).format('HH:mm');
        const startTime = dayjs(fromHour, 'HH:mm');
        const endTime = dayjs(toHour, 'HH:mm').subtract(15, 'm');
        const startTime2 = dayjs(startTime.subtract(data.duree, 'm'), 'HH:mm');
        const timeDiff = endTime.diff(startTime2, 'minute');
        console.log(timeDiff)
        for (let i = 15; i <= timeDiff; i += 15) {
          const hour = startTime2.add(i, 'minute').format('HH:mm');
          console.log(hour)
          setDisabledHours((disabledHours) => ({ ...disabledHours, ['' + hour + '']: true }));
        }
      }
    })
  }

  useEffect(() => {
    console.log(disabledHours)
  }, [disabledHours])

  useEffect(() => {
    data.duree && verifyReserved()
  }, [data])

  return (
    <Layout>
      <Layout className=" bg-light">
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            borderRadius: 20,
            background: '#fff',
          }}>
          <Container className="p-lg-5  shadow-lg p-3 mb-5 bg-white rounded ">
            <div className="">
              <Row className='align-items-center justify-content-between'>
                <div className="col-auto">
                  <h1 className=" fs-3 align-items-center d-flex">
                    <CalendarOutlined className='me-3 fs-2 mt-1' />
                    Prenez un rendez-vous
                  </h1>

                </div>

              </Row>
            </div>

            {

              isSent ?
                <Result
                  status="success"
                  title="Votre RDV est bien enregistrer, Merci!"

                />
                :

                <Row className="mt-5">
                  <Col xl='11 mx-auto'>
                    <Col xl='5 mx-auto'>

                      <Row>
                        <Col>
                          <p>Nom et Prénom:</p>
                        </Col>
                        <Col>
                          <Input status={errors?.nom ? 'error' : ''} onChange={(v) => setData({ ...data, nom: v.currentTarget.value })} placeholder="Nom et prénom" />
                        </Col>
                      </Row>


                      <Row>
                        <Col>
                          <p>Numéro de téléphone</p>
                        </Col>
                        <Col>
                          <Input status={errors?.tel ? 'error' : ''} value={data?.tel} onChange={(e) => {
                            const numericValue = e.target.value.replace(/[^0-9]/g, '');
                            setData({ ...data, tel: numericValue });
                          }} placeholder="+33" />
                        </Col>
                      </Row>


                      <Row>
                        <Col>
                          <p>Mail</p>
                        </Col>
                        <Col>
                          <Input onBlur={(e) => checkIfHasRdv(e.currentTarget.value)} status={errors?.mail ? 'error' : ''} onChange={(v) => setData({ ...data, mail: v.currentTarget.value })} placeholder="Entrer votre mail" />
                        </Col>
                      </Row>

                      <Row>
                        <Col>
                          <p>L'établissement</p>
                        </Col>
                        <Col>
                          <Input status={errors?.mail ? 'error' : ''} onChange={(v) => setData({ ...data, etablissement: v.currentTarget.value })} placeholder="Nom d'établissement" />
                        </Col>
                      </Row>


                      <Row>
                        <Col>
                          <p>Objet</p>
                        </Col>
                        <Col>
                          <Form.Select status={errors?.objet ? 'error' : ''} onChange={handleSelectChange} aria-label="Default select example" size="sm">
                            <option value="Instalation">Instalation</option>
                            <option value="Revue des instalations">Revue des instalations</option>
                            <option value="Demande d'information">Demande d'information</option>
                            <option value="Besoin d'aide">Besoin d'aide</option>
                            <option value="autre">Autre</option>
                          </Form.Select>
                        </Col>
                      </Row>


                    </Col>




                    {isVisible && (
                      <TextArea rows={7} onChange={(v) => setData({ ...data, objet: v.currentTarget.value })} />)}
                    <Row >
                      <Col xl='' className=' mt-5 '>
                        <div  >
                          <Calendar disabledDate={disabledDate} onChange={(v) => { setData({ ...data, date: dayjs(v).format('YYYY-MM-DD') }); verifyReserved(v) }} fullscreen={false} onPanelChange={onPanelChange} />
                        </div>
                      </Col>
                      {data.date && (
                        <Col className='text-center'>

                          <Row className='mt-5 justify-content-between align-items-baseline '>
                            <Col md={6} xs={12}>
                              <p className='d-block text-start ms-3'>La durée de réunion</p>
                            </Col>

                            <Col md={6} xs={12}>
                              <Form.Select onChange={(v) => { setData({ ...data, duree: v.target.value }); handleChangeduree(v) }} size="sm">
                                <option value="" disabled selected>Séléctionnez la durée</option>
                                <option value="15"> 15 min </option>
                                <option value="30"> 30 min </option>
                                <option value="45"> 45 min </option>
                                <option value="60"> 1 Heure </option>
                              </Form.Select>
                            </Col>
                          </Row>

                          {visibledate && (
                            <Radio.Group onChange={onChange} value={value}>

                              <Radio.Group onChange={(v) => setData({ ...data, heure: v.target.value })} defaultValue="a" size="large">
                                <div className=''>
                                  <div>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['09:00']} value="09:00">09:00</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['09:15']} value="09:15">09:15</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['09:30']} value="09:30">09:30</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['09:45']} value="09:45">09:45</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['10:00']} value="10:00">10:00</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['10:15']} value="10:15">10:15</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['10:30']} value="10:30">10:30</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['10:45']} value="10:45">10:45</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['11:00']} value="11:00">11:00</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['11:15']} value="11:15">11:15</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['11:30']} value="11:30">11:30</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['11:45']} value="11:45">11:45</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['12:00']} value="12:00">12:00</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['12:15']} value="12:15">12:15</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['12:30']} value="12:30">12:30</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['12:45']} value="12:45">12:45</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['13:00']} value="13:00">13:00</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['13:15']} value="13:15">13:15</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['13:30']} value="13:30">13:30</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['13:45']} value="13:45">13:45</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['14:00']} value="14:00">14:00</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['14:15']} value="14:15">14:15</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['14:30']} value="14:30">14:30</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['14:45']} value="14:45">14:45</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['15:00']} value="15:00">15:00</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['15:15']} value="15:15">15:15</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['15:30']} value="15:30">15:30</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['15:45']} value="15:45">15:45</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['16:00']} value="16:00">16:00</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['16:15']} value="16:15">16:15</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['16:30']} value="16:30">16:30</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['16:45']} value="16:45">16:45</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['17:00']} value="17:00">17:00</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['17:15']} value="17:15">17:15</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['17:30']} value="17:30">17:30</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['17:45']} value="17:45">17:45</Radio.Button>
                                    <Radio.Button className='mt-3 rounded mx-1' disabled={disabledHours['18:00']} value="18:00">18:00</Radio.Button>

                                  </div>
                                </div>
                              </Radio.Group>
                            </Radio.Group>
                          )}

                        </Col>
                      )}
                    </Row>






                    <div className='text-end'>
                      <Button onClick={() => {
                        if (data?.nom?.trim() === '' || !data.nom) {
                          setErrors((errors) => ({ ...errors, nom: true }))
                        } else {
                          setErrors((errors) => ({ ...errors, nom: false }))

                        }
                        if (data?.tel?.trim() === '' || !data.tel) {
                          setErrors((errors) => ({ ...errors, tel: true }))
                        } else {
                          setErrors((errors) => ({ ...errors, tel: false }))

                        }
                        if (data?.mail?.trim() === '' || !data.mail) {
                          setErrors((errors) => ({ ...errors, mail: true }))
                        } else {
                          setErrors((errors) => ({ ...errors, mail: false }))

                        }
                        if (data?.etablissement?.trim() === '' || !data.etablissement) {
                          setErrors((errors) => ({ ...errors, etablissement: true }))
                        } else {
                          setErrors((errors) => ({ ...errors, etablissement: false }))

                        }

                        if (data?.date?.trim() === '' || !data.date) {
                          setErrors((errors) => ({ ...errors, date: true }))
                        } else {
                          setErrors((errors) => ({ ...errors, date: false }))

                        }
                        console.log(errors)
                        // console.log(errors)
                        if (Object.values(errors).filter(value => value === true).length < 1) {
                          setOpen(true)
                        }


                      }} variant='outline-primary ' size='sm' className='rounded mt-5'>
                        Enregistrer le rendez-vous
                      </Button>
                      {Object.values(errors).filter(value => value === true).length > 1 && <div className='d-flex gap-3 '><InfoCircleOutlined style={{ color: 'red' }} /><p style={{ color: 'red' }}>S'il vous plaît, veuillez remplir tous les champs.</p></div>}
                    </div>


                  </Col>

                </Row>

            }

            <Modal footer={[
              <Button onClick={() => setOpen(false)} variant='outline-primary ' size='sm' className='rounded m-2' key="back" >
                Annuler
              </Button>,
              <Button variant='outline-primary ' size='sm' className='rounded m-2' key="submit" onClick={() => {
                addEvent({
                  summary: "RDV client Objet : " + data.objet + " Notez-Nous",
                  location: "",
                  start: {
                    dateTime: data.date + "T" + dayjs(data.date + 'T' + data.heure).format('HH:mm') + ":00",
                    timeZone: "Europe/Paris",
                  },
                  end: {
                    dateTime: data.date + "T" + dayjs(data.date + 'T' + data.heure).add(data.duree, 'm').format('HH:mm') + ":00",
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
                })
              }} >
                Confirmer
              </Button>,
            ]} title="Confirmation de rendez-vous" centered open={open} onOk={() => setOpen(false)} onCancel={() => setOpen(false)} width={1000}  >
              <div >
                <hr></hr>
                <p>Cher(e) {data.nom} <br></br> Nous sommes ravis de vous confirmer votre rendez-vous prévu le <strong>{data.date}</strong> à <strong> {dayjs(data.date + 'T' + data.heure).format('HH:mm')}</strong> - <strong> {dayjs(data.date + 'T' + data.heure).add(data.duree, 'm').format('HH:mm')}</strong>.<br></br>
                  Nous sommes prêts à vous recevoir et à vous fournir le service attendu pour <span style={{ color: '#1677ff' }}> "{data.objet}"</span> .</p>
                Cliquez sur le bouton confirmer pour confirmer votre rendez-vous.
              </div>
            </Modal>
          </Container>

        </Content>
      </Layout>
    </Layout >
  );
}

export default Client;
