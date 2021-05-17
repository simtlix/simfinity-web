import React, { useEffect, useState, useRef } from "react";
import { Layout, Menu, Typography, ConfigProvider} from "antd";
import { Styled } from "direflow-component";
import PropTypes from "prop-types";
import { requestEntities } from "./utils";
import Table from "./Table/Table";
import Form from "./Form/Form";
import styles from "./App.css";
import {FormattedMessage, useIntl} from 'react-intl';



const { Title, Paragraph } = Typography;
const { Header, Content, Footer, Sider } = Layout;
export const EntitiesContext = React.createContext();

const App = ({ url }) => {
  const popupRef = useRef();
  const [collapsed, setCollapsed] = useState(false);
  const [entities, setEntities] = useState([]);
  const [allEntities, setAllEntities] = useState([]);
  const [currentEntity, setCurrentEntity] = useState(null);
  const [resultTitle, setResultTitle] = useState("");
  const [selectedKey, setSelectedKey] = useState("0");
  const intl = useIntl();

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    requestEntities(url).then((entities) => {
      if (entities) {
        const filterEmbeddedEntity = entities.filter(
          (entity) => entity?.queryAll
        );
        setEntities(filterEmbeddedEntity);
        setAllEntities(entities);
      }
    });
  }, [url]);

  const handleClick = (entity, ind) => {
    setCurrentEntity(entity);
    setResultTitle(intl.formatMessage({ id:`entity.${entity.name}.plural`, defaultMessage:`Resultados de ${entity.name}`}));
    setSelectedKey(ind.toString());
  };
  const renderEntities = entities.map((entity, index) => (
    <Menu.Item key={index} onClick={() => handleClick(entity, index)}>
      <Paragraph
        style={{
          color: "white",
          textTransform: "uppercase",
          fontWeight: "bold",
        }}
      >
        <FormattedMessage id={`entity.${entity.name}.plural`} defaultMessage={entity.name}></FormattedMessage>
        
      </Paragraph>
    </Menu.Item>
  ));

  const onShowFormBtn = () => {
    setShowForm(!showForm);
  };

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };
  return (
    <EntitiesContext.Provider value={entities}>
      <Styled styles={styles}>
        <Layout style={{ minHeight: "100vh", display: "flex", flex: "auto" }}>
          <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
            <Menu theme="dark" selectedKeys={[selectedKey]} mode="inline">
              {renderEntities}
            </Menu>
          </Sider>
          <Layout className="site-layout">
            <Header className="site-layout-background" style={{ padding: 0 }}>
              {" "}
            </Header>
            <Content style={{ margin: "0 16px" }}>
              <Title level={2} style={{ textAlign: "center" }}>
                {resultTitle}
              </Title>

              <Button
                style={{ float: "right" }}
                type="primary"
                size="large"
                onClick={onShowFormBtn}
              >
                {showForm ? "Show Table" : "Add new entry"}
              </Button>

              <div>
                {showForm ? (
                  <Form displayEntity={currentEntity} />
                ) : (
                  <Table displayEntity={currentEntity}  entities={allEntities}/>
                )}
              </div>
            </Content>
            <Footer style={{ textAlign: "center" }}>Simtlix ©2021</Footer>
          </Layout>
        </Layout>
      </Styled>
    </EntitiesContext.Provider>
  );
};

App.defaultProps = {
  url: "",
};

App.propTypes = {
  url: PropTypes.string,
};

export default App;
