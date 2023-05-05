import React, { useState, useEffect } from 'react';
import { SearchOutlined, PlusOutlined, SnippetsTwoTone, InfoCircleOutlined, MailOutlined, PieChartOutlined } from '@ant-design/icons';
import { Layout, theme, Radio, Modal, DatePicker, Space, Table, Calendar } from 'antd';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import { gapi } from 'gapi-script';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useNavigate } from "react-router-dom";





const { Header, Sider, Content } = Layout;
const { RangePicker } = DatePicker;

dayjs.extend(customParseFormat);

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

const onPanelChange = (value, mode) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};





const Admin = () => {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [data0, setData0] = useState([]);
  const [data1, setData1] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [datadate, setDatadate] = useState([]);
  const [dateRange, setDateRange] = useState({});



  const handleToggleVisibility = () => {
    setIsVisible(!isVisible);
  };


  useEffect(() => {
    getRdv()
    getRdvcanceled()
  }, []);



  const handleDateRangeChange = (dates) => {
    if (dates) {
      setDateRange({
        from: dates[0].format('YYYY-MM-DD'),
        to: dates[1].format('YYYY-MM-DD')
      });
    } else {
      setDateRange({});
    }
  }

  useEffect(() => {
    getRdv()
    getRdvcanceled()
  }, [dateRange])


  const getRdvblocker = () => {
    fetch('http://localhost:2000/api/rdv_blocker')
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(item => {
          return {
            date: item.date,
            heure: item.heure
          };
        });
        setData0(formattedData);
      })
      .catch(error => console.error(error));
  }

  const getRdv = () => {
    fetch('http://localhost:2000/api/clients/reserved' + (
      dateRange.from ? `/${dateRange.from}/${dateRange.to}` : ''
    ))
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(item => {
          return {
            key: item.user_id,
            rdv_id: item.rdv_id,
            id_event: item.id_event,
            nom_prenom: item.nom_prenom,
            email: item.email,
            tel: item.tel,
            etablissement: item.etablissement,
            objet: item.objet,
            date: item.date,
            heure: item.heure,
            duree: item.duree,
          };
        });
        setData0(formattedData);
      })
      .catch(error => console.error(error));
  }

  const getRdvcanceled = () => {
    fetch('http://localhost:2000/api/clients/canceled' + (
      dateRange.from ? `/${dateRange.from}/${dateRange.to}` : ''
    ))
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(item => {
          return {
            key: item.user_id,
            rdv_id: item.rdv_id,
            nom_prenom: item.nom_prenom,
            email: item.email,
            tel: item.tel,
            etablissement: item.etablissement,
            objet: item.objet,
            date: item.date,
            heure: item.heure,
            duree: item.duree,
          };
        });
        setData1(formattedData);
      })
      .catch(error => console.error(error));
  }

  const columns = [
    {
      title: 'Nom et prénom',
      dataIndex: 'nom_prenom',
      key: 'nom_prenom',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Téléphone',
      dataIndex: 'tel',
      key: 'tel',
    },
    {
      title: 'L\'établissement',
      dataIndex: 'etablissement',
      key: 'etablissement',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Heure',
      dataIndex: 'heure',
      key: 'heure',
    },
    {
      title: 'Durée',
      dataIndex: 'duree',
      key: 'duree',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button size="sm" variant="danger" onClick={() => {

            let id = record.rdv_id;

            fetch('http://localhost:2000/api/rdv/update/' + id, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(
                {
                  "status": "CANCELED"
                }
              )
            })
              .then(response => response.json())
              .then(data => {
                console.log(data)
                getRdv()
                getRdvcanceled()
                removeEvent(record.id_event)
              });

          }}>Annuler</Button>
        </Space>
      ),
    },
  ];
  const columns1 = [
    {
      title: 'Nom et prénom',
      dataIndex: 'nom_prenom',
      key: 'nom_prenom',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Téléphone',
      dataIndex: 'tel',
      key: 'tel',
    },
    {
      title: 'L\'établissement',
      dataIndex: 'etablissement',
      key: 'etablissement',
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Heure',
      dataIndex: 'heure',
      key: 'heure',
    },
    {
      title: 'Durée',
      dataIndex: 'duree',
      key: 'duree',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button size="sm" variant="danger" onClick={() => {

            let id = record.key;

            fetch('http://localhost:2000/api/clients/delete/' + id, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' }
            })
              .then(response => response.json())
              .then(data => {
                console.log(data)
                getRdvcanceled()
              });

          }}>Supprimer</Button>
        </Space>
      ),
    },
  ];





  //test


  const { token } = theme.useToken();
  const [value, setValue] = useState(1);

  const [visibledate, setVisibledate] = useState(false);

  const [data, setData] = useState({
    objet: 'installation',
    duree: 15
  });
  const [errors, setErrors] = useState({
    nom: true
  });

  const [refreshToken, setRefreshToken] = useState(null);
  const calendarID = '1f480b29afce3df3b4d365a3396bfa1dc2e086de66af2ac395b8c1d8fa96daae@group.calendar.google.com';
  const apiKey = 'process.env.REACT_APP_GOOGLE_API_KEY';
  const [isSent, setIsSent] = useState(false);
  const appointmentDate = new Date('2023-05-01T10:00:00Z');
  const [reserved, setReserved] = useState([]);
  const [disabledHours, setDisabledHours] = useState({});



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


  const removeEvent = (eventId) => {
    function initiate() {
      gapi.client
        .request({
          path: `https://www.googleapis.com/calendar/v3/calendars/${calendarID}/events/${eventId}?sendUpdates=all`,
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        })
        .then(
          (response) => {
            console.log(response)
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


  const addRdvblocker = () => {
    fetch('http://localhost:2000/api/rdv_blocker/insert', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {
          "date": data.date,
          "heure": data.heure

        }
      )
    })
      .then(response => response.json())
      .then(data => console.log(data));
  }


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
            <Row><h2 className="fs-2 align-items-center d-flex">
              <SnippetsTwoTone className='me-4 fs-1' />
              Gestion de rendez-vous
            </h2></Row>
            <Row className='mt-4'>
              <div className='text-end'><Button onClick={() => setOpen(true)} style={{ width: '250px' }} className='me-0' size="sm" type="primary">
                <InfoCircleOutlined className='me-2 fs-6 p-1 ' />Blocker des rendez-vous </Button>
              </div>
            </Row>
            <Row className='mt-4'>
              <div className='text-end'><Button onClick={() => navigate("/")} style={{ width: '250px' }} className='me-0' size="sm" type="primary">
                <PlusOutlined className='me-2 fs-6 p-1 ' />Ajouter un rendez-vous</Button>
              </div>
            </Row>
            <Row className='mt-4'>
              <Col>
                <h5 className="fs-5 align-items-center d-flex">
                  <SearchOutlined className='me-3 fs-4 mt-1' />
                  Filtrer
                </h5>

              </Col>
              <Col>
                <RangePicker onChange={handleDateRangeChange} />

              </Col>
            </Row>
            <Table className='mt-5' columns={columns} dataSource={data0} />

            <Row>
              <div>
                <Button onClick={handleToggleVisibility} > Historiques</Button>
              </div>
              {isVisible &&

                <Table className='mt-5' columns={columns1} dataSource={data1} />}
            </Row>

            <Modal title="Blocker la date et l'heure"
              centered
              open={open}
              onOk={() => { addRdvblocker(); setOpen(false) }}
              onCancel={() => setOpen(false)}
              width={1000}
            >
              <Row >
                <Col xl='6' className=' mt-5 '>
                  <div  >
                    <Calendar disabledDate={disabledDate} onChange={(v) => { setData({ ...data, date: dayjs(v).format('YYYY-MM-DD') }); verifyReserved(v) }} fullscreen={false} onPanelChange={onPanelChange} />
                  </div>
                </Col>

                <Col className='text-center'>

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


                </Col>

              </Row>
            </Modal>
          </Container>

        </Content>
      </Layout>
    </Layout >
  );
}

export default Admin;
