import React, { useEffect, useState, useRef } from 'react';
import { Layout, Menu, Typography, ConfigProvider } from 'antd';
import { Styled } from 'direflow-component';
import PropTypes from 'prop-types';
import { requestEntities } from './utils';
import styles from './App.css';
import { FormattedMessage, useIntl } from 'react-intl';
import { EntitiesContext } from './entities-context';
import { ConfigContext } from './config-context';
import 'antd/dist/antd.css';
import CRUD from './CRUD/CRUD';

const { Title, Paragraph } = Typography;
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
        //console.log(entities);
        setAllEntities(entities);
        const filterEmbeddedEntity = entities.filter(
          (entity) => entity?.queryAll
        );
        setEntities(filterEmbeddedEntity);
        setAllEntities(entities);
      }
    });
  }, [url]);

  const renderEntities = entities.map((entity, index) => (
    <Menu.Item
      key={index}
      onClick={() => {
        // eslint-disable-next-line
        setCurrentEntity(entity);
        setResultTitle(
          intl.formatMessage({
            id: `entity.${entity.name}.plural`,
            defaultMessage: `Resultados de ${entity.name}`,
          })
        );
        setSelectedKey(index.toString());
      }}
    >
      <Paragraph
        style={{
          color: 'white',
          textTransform: 'uppercase',
          fontWeight: 'bold',
        }}
      >
        <FormattedMessage
          id={`entity.${entity.name}.plural`}
          defaultMessage={entity.name}
        ></FormattedMessage>
      </Paragraph>
    </Menu.Item>
  ));

  // const onShowFormBtn = () => {
  //   setShowForm(!showForm);
  // };

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  return (
    <ConfigContext.Provider value={{ url }}>
      <EntitiesContext.Provider value={allEntities}>
        <ConfigProvider getPopupContainer={() => popupRef.current}>
          <Styled styles={styles}>
            <Layout
              style={{ minHeight: '100vh', display: 'flex', flex: 'auto' }}
            >
              <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
                <Menu theme="dark" selectedKeys={[selectedKey]} mode="inline">
                  {renderEntities}
                </Menu>
              </Sider>
              <Layout className="site-layout">
                <Header
                  className="site-layout-background"
                  style={{ padding: 0 }}
                >
                  {' '}
                </Header>
                <Content style={{ margin: '0 16px' }}>
                  <Title level={2} style={{ textAlign: 'center' }}>
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
          </Styled>
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
