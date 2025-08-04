import React, { useEffect, useState, useRef } from 'react';
import { Layout, Menu, Typography, ConfigProvider } from 'antd';
import { FormattedMessage, useIntl } from 'react-intl';
import { requestEntities } from '../src/components/utils';
import { EntitiesContext } from '../src/components/entities-context';
import { ConfigContext } from '../src/components/config-context';
import CRUD from '../src/components/CRUD/CRUD';

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
  }, [entities, intl]);

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

  const menuItems = entities.map((entity, index) => ({
    key: index.toString(),
    label: (
      <FormattedMessage
        id={`entity.${entity.name}.plural`}
        defaultMessage={entity.name}
      />
    ),
    className: "fadeIn",
    style: {
      textTransform: 'uppercase',
      fontWeight: 'bold',
    },
    onClick: () => handleClick(entity, index),
  }));

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
                  items={menuItems}
                />
              </Sider>
              <Layout className="site-layout">
                <Header className="site-layout-background" style={{ padding: 0 }} />
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
                    />
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

export default App; 