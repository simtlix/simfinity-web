import React, { useEffect, useState, useRef } from 'react';
import { Layout, Menu, Typography, ConfigProvider } from 'antd';
import PropTypes from 'prop-types';
import { requestEntities } from './utils';
import { FormattedMessage, useIntl } from 'react-intl';
import { EntitiesContext } from './entities-context';
import { ConfigContext } from './config-context';
import CRUD from './CRUD/CRUD';
import 'antd/dist/antd.css';
import './App.css';

const { Title } = Typography;
const { Header, Content, Footer, Sider } = Layout;

const App = ({ url }) => {
  const popupRef = useRef();
  const [collapsed, setCollapsed] = useState(false);
  const [allEntities, setAllEntities] = useState([]);
  const [entities, setEntities] = useState([]);
  const [currentEntity, setCurrentEntity] = useState(null);
  const [resultTitle, setResultTitle] = useState('');
  const [selectedKey, setSelectedKey] = useState('0');
  const intl = useIntl();
  useEffect(() => {
    requestEntities(url).then((entities) => {
      if (entities) {
        setAllEntities(entities);
        const filterEmbeddedEntity = entities.filter(
          (entity) => entity?.queryAll
        );
        setEntities(filterEmbeddedEntity);
        setAllEntities(entities);
      }
    });
  }, [url]);

  useEffect(() => {
    // usar useCallBack
    const handleClick = (entity, ind) => {
      setCurrentEntity(entity);
      setResultTitle(
        intl.formatMessage({
          id: `entity.${entity.name}.plural`,
          defaultMessage: `Resultados de ${entity.name}`,
        })
      );
      setSelectedKey(ind.toString());
    };
    if (entities[0]?.name) {
      handleClick(entities[0], 0);
    }
    // eslint-disable-next-line
  }, [entities]);
  const handleClick = (entity, ind) => {
    setCurrentEntity(entity);
    setResultTitle(
      intl.formatMessage({
        id: `entity.${entity.name}.plural`,
        defaultMessage: `Resultados de ${entity.name}`,
      })
    );
    setSelectedKey(ind.toString());
  };
  const renderEntities = entities.map((entity, index) => {
    return (
      <Menu.Item
        key={index}
        className="fadeIn"
        onClick={() => handleClick(entity, index)}
        style={{
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        <FormattedMessage
          id={`entity.${entity.name}.plural`}
          defaultMessage={entity.name}
        ></FormattedMessage>
      </Menu.Item>
    );
  });

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  return (
    <ConfigContext.Provider value={{ url }}>
      <EntitiesContext.Provider value={allEntities}>
        <ConfigProvider getPopupContainer={() => popupRef.current}>
          <div className="app-container">
            <Layout style={{ minHeight: '100vh', display: 'flex', flex: 'auto' }}>
              <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                <Menu
                  theme="dark"
                  selectedKeys={[selectedKey]}
                  mode="inline"
                  style={{ marginTop: '60px' }}
                  hidden={collapsed}
                >
                  {renderEntities}
                </Menu>
              </Sider>
              <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }}>
                  {' '}
                </Header>
                <Content style={{ margin: '0 16px' }} className="fadeInLonger">
                  <Title
                    level={2}
                    style={{
                      textAlign: 'center',
                      paddingTop: 12,
                    }}
                  >
                    {resultTitle}
                  </Title>

                  {currentEntity && (
                    <CRUD
                      entity={currentEntity}
                      key={currentEntity.name}
                      entities={allEntities}
                      url={url}
                    ></CRUD>
                  )}
                </Content>
                <Footer style={{ textAlign: 'center' }}>Simtlix ©2021</Footer>
                <div ref={popupRef}></div>
              </Layout>
            </Layout>
          </div>
        </ConfigProvider>
      </EntitiesContext.Provider>
    </ConfigContext.Provider>
  );
};

App.defaultProps = {
  url: '',
};

App.propTypes = {
  url: PropTypes.string,
};

export default App;
