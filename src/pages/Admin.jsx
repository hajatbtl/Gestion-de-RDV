import React, { useState, useEffect } from 'react';
import { SearchOutlined, PlusOutlined, SnippetsTwoTone, InfoCircleOutlined, MailOutlined, PieChartOutlined } from '@ant-design/icons';
import { Layout, theme, Radio, Modal, DatePicker, Space, Table, Checkbox, TimePicker } from 'antd';
import { Button, Col, Container, Form, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import dayjs from 'dayjs';
import { gapi } from 'gapi-script';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { useNavigate } from "react-router-dom";





const { Header, Sider, Content } = Layout;
const { RangePicker } = DatePicker;
const onChange3 = (checkedValues) => {
  console.log('checked = ', checkedValues);
};


dayjs.extend(customParseFormat);

const range = (start, end) => {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
};

const onChange = (date, dateString) => {
  console.log(date, dateString);
};

const onPanelChange = (value, mode) => {
  console.log(value.format('YYYY-MM-DD'), mode);
};
const options = [];
for (let i = 10; i < 36; i++) {
  options.push({
    label: i.toString(36) + i,
    value: i.toString(36) + i,
  });
}
const handleChange = (value) => {
  console.log(`selected ${value}`);
};



const Admin = () => {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [data0, setData0] = useState([]);
  const [data1, setData1] = useState([]);
  const [data2, setData2] = useState([]);
  const [plageHoraires, setPlageHoraires] = useState([]);
  const [isVisible, setIsVisible] = useState(false);
  const [dateRange, setDateRange] = useState({});
  const [selectedOption, setSelectedOption] = useState('');
  const [value2, setValue2] = useState(0);
  const [isChecked, setIsChecked] = useState(false);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setIsChecked(false);
    setSelectedOption('');
  };



  const onChange2 = (e) => {
    console.log('radio checked', e.target.value);

    setData2({ ...data2, state: e.target.value });
  };
  const lundi = (e) => {
    console.log('radio checked', e.target.value);
    const lundiValue = e.target.checked ? 1 : 0;
    setData2({ ...data2, lundi: lundiValue });
  };
  const mardi = (e) => {
    console.log('radio checked', e.target.value);
    const lundiValue = e.target.checked ? 1 : 0;
    setData2({ ...data2, mardi: lundiValue });
  };
  const mercredi = (e) => {
    console.log('radio checked', e.target.value);
    const lundiValue = e.target.checked ? 1 : 0;
    setData2({ ...data2, mercredi: lundiValue });
  };
  const jeudi = (e) => {
    console.log('radio checked', e.target.value);
    const lundiValue = e.target.checked ? 1 : 0;
    setData2({ ...data2, jeudi: lundiValue });
  };
  const vendredi = (e) => {
    console.log('radio checked', e.target.value);
    const lundiValue = e.target.checked ? 1 : 0;
    setData2({ ...data2, vendredi: lundiValue });
  };
  const samedi = (e) => {
    console.log('radio checked', e.target.value);
    const lundiValue = e.target.checked ? 1 : 0;
    setData2({ ...data2, samedi: lundiValue });
  };
  const dimanche = (e) => {
    console.log('radio checked', e.target.value);
    const lundiValue = e.target.checked ? 1 : 0;
    setData2({ ...data2, dimanche: lundiValue });
  };




  useEffect(() => {
    console.log(data2)
  }, [data2])


  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  const disabledHours1 = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      if (i < 9 || i > 18) {
        hours.push(i);
      }
    }
    return hours;
  };



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



  const addPlageoriat = () => {
    fetch('http://localhost:2000/api/plageoriat/add', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        dated: data2.dated,
        datef: data2.datef,
        timed: data2.timed,
        timef: data2.timef,
        lundi: data2.lundi,
        mardi: data2.mardi,
        mercredi: data2.mercredi,
        jeudi: data2.jeudi,
        vendredi: data2.vendredi,
        samedi: data2.samedi,
        dimanche: data2.dimanche,
        state: data2.state,
      }),
    })
      .then(response => response.json())
      .then(data => getPlageoreat())
      .catch(error => {
        console.error(error);
        // Gestion des erreurs
      });
  };

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

  const getPlageoreat = () => {
    fetch('http://localhost:2000/api/plageoriat/1' + (
      dateRange.from ? `/${dateRange.from}/${dateRange.to}` : ''
    ))
      .then(response => response.json())
      .then(data => {
        const formattedData = data.map(item => {
          return {
            id: item.id,
            dated: item.dated,
            datef: item.datef,
            timed: item.timed,
            timef: item.timef,
            lundi: item.lundi,
            mardi: item.mardi,
            mercredi: item.mercredi,
            jeudi: item.jeudi,
            vendredi: item.vendredi,
            samedi: item.samedi,
            dimanche: item.dimanche,
            state: item.state,
          };
        });
        setPlageHoraires(formattedData);
      })
      .catch(error => console.error(error));
  }

  useEffect(() => {
    addPlageoriat()
    getPlageoreat()
  }, [])

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


  const columns2 = [
    {
      title: 'Date début',
      dataIndex: 'dated',
      key: 'dated',

    },
    {
      title: 'Date fin',
      dataIndex: 'datef',
      key: 'datef',
    },
    {
      title: 'Heure début',
      dataIndex: 'timed',
      key: 'timed',
    },
    {
      title: 'Heure fin',
      dataIndex: 'timef',
      key: 'timef',
    },
    // {
    //   title: 'Les jours',
    //   render: (text) => <a>{lundi}</a>,
    //   key: 'jour',
    // },

    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button
            size="sm"
            variant="danger"
            onClick={() => {
              let id = record.id;

              fetch(`http://localhost:2000/api/plageoriat/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  state: '0',
                }),
              })
                .then(response => response.json())
                .then(data => {
                  console.log(data);
                  getPlageoreat();
                });
            }}
          >
            Fermer
          </Button>


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
  const [blocked, setBlocked] = useState([]);
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
                <InfoCircleOutlined className='me-2 fs-6 p-1 ' />Gestion des plages horraire </Button>
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











            <Modal title="Gestion des plages horraire"
              centered
              open={open}
              onOk={() => {
                addPlageoriat();navigate(0); setOpen(false);
              }}
              onCancel={() => setOpen(false)}
              width={1000}
            >
              <Radio.Group onChange={onChange2}>
                <Radio value={1}>Ouvrir une plage horaire</Radio>
                <Radio value={0}>Fermer une plage horaire</Radio>
              </Radio.Group>


              <Row className='mt-5'>
                <Col xl={3}>
                  <h6>Heure début :</h6>
                  <TimePicker onChange={(v) => { setData2({ ...data2, timed: dayjs(v).format('HH:mm') }); verifyReserved(v) }} minuteStep={15} hourStep={1} format="HH:mm" disabledHours={disabledHours1} hideDisabledOptions />
                </Col>
                <Col>
                  <h6 >Heure fin :</h6>
                  <TimePicker onChange={(v) => { setData2({ ...data2, timef: dayjs(v).format('HH:mm') }); verifyReserved(v) }} minuteStep={15} hourStep={1} format="HH:mm" disabledHours={disabledHours1} hideDisabledOptions />
                </Col>
              </Row>

              <Row className='mt-5' >
                <Radio.Group onChange={handleOptionChange} value={selectedOption}>
                  <Radio value={1}>Recurence</Radio>
                  <Radio value={2}>Date</Radio>
                </Radio.Group>
              </Row>
              {selectedOption === 1 &&
                <>
                  <Row className='mt-5'>
                    <Space direction="vertical" size={12}>
                      <RangePicker onChange={(v) => {
                        setData2({
                          ...data2, dated: dayjs(v[0]).format('YYYY-MM-DD'), datef: dayjs(v[1]).format('YYYY-MM-DD')
                        });
                        verifyReserved(v)
                      }} />
                    </Space>
                  </Row>
                  <Row className='mt-5'>
                    <Checkbox.Group
                      style={{
                        width: '100%',
                      }}
                      onChange={onChange3}
                    >
                      <Row>
                        <Col xl={6}>
                          <Checkbox onChange={lundi} value="Lundi">Lundi</Checkbox>
                          <br></br>
                          <Checkbox onChange={mardi} value="Mardi">Mardi</Checkbox>
                          <br></br>
                          <Checkbox onChange={mercredi} value="Mercredi">Mercredi</Checkbox>
                          <br></br>
                          <Checkbox onChange={jeudi} value="Jeudi">Jeudi</Checkbox>
                        </Col>
                        <Col xl={6}>
                          <Checkbox onChange={vendredi} value="Vendredi">Vendredi</Checkbox>
                          <br></br>
                          <Checkbox onChange={samedi} value="Samedi">Samedi</Checkbox>
                          <br></br>
                          <Checkbox onChange={dimanche} value="Dimanche">Dimanche</Checkbox>
                        </Col>
                      </Row>
                      <Row> </Row>
                    </Checkbox.Group>

                  </Row>
                </>
              }
              {selectedOption === 2 &&

                <Row className='mt-3'>
                  <Space direction="vertical" size={12}>
                    <DatePicker onChange={(v) => { setData({ ...data2, dated: dayjs(v).format('YYYY-MM-DD') }); verifyReserved(v); onChange() }} />
                  </Space>
                </Row>

              }




              {selectedOption === 'option2' && <div>Div 2</div>}


              <Row>
                <Table className='mt-5' columns={columns2} dataSource={plageHoraires} />
              </Row>
            </Modal>
          </Container>

        </Content>
      </Layout>
    </Layout >
  );
}

export default Admin;
