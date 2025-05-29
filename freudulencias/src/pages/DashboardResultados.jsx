import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Card, Statistic, Typography, Button } from 'antd';
import './DashboardResultados.css';

const { Title } = Typography;

const DashboardResultados = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const resultados = location.state;

  if (!resultados) {
    return (
      <div style={{ padding: 24 }}>
        <Title level={3}>Nenhum dado de resultado disponível.</Title>
        <Button type="primary" onClick={() => navigate('/')}>Voltar</Button>
      </div>
    );
  }

  const { modelo, lucro, acuracia, precisao, f1_score } = resultados;

  return (
    <div className="resultados-container">
      <Title level={2} className="resultados-title">Resultados da Análise</Title>
      <div className="resultados-grid">
        <Card className="resultados-card">
          <Statistic title="Modelo Utilizado" value={modelo} />
        </Card>
        <Card className="resultados-card lucro-verde">
          <Statistic title="Lucro Gerado (R$)" value={lucro} precision={2} />
        </Card>
        <Card className="resultados-card">
          <Statistic title="Acurácia" value={acuracia * 100} precision={2} suffix="%" />
        </Card>
        <Card className="resultados-card">
          <Statistic title="Precisão" value={precisao * 100} precision={2} suffix="%" />
        </Card>
        <Card className="resultados-card">
          <Statistic title="F1 Score" value={f1_score * 100} precision={2} suffix="%" />
        </Card>
      </div>
    </div>
  );
};

export default DashboardResultados;
