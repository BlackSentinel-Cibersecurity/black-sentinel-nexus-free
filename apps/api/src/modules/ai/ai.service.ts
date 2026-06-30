import { Injectable, Logger } from '@nestjs/common';
import { AIAnalysisRequest, AIAnalysisResponse, QueryTranslation, PredictionResult } from '@bsn/types';
import { v4 as uuidv4 } from 'uuid';
import OpenAI from 'openai';

@Injectable()
export class AIService {
  private readonly logger = new Logger(AIService.name);
  private openai: OpenAI | null = null;

  constructor() {
    const apiKey = process.env.AI_API_KEY;
    if (apiKey && apiKey !== 'your-api-key-here') {
      this.openai = new OpenAI({ apiKey });
      this.logger.log('OpenAI integration enabled');
    } else {
      this.logger.log('OpenAI not configured - using mock AI responses');
    }
  }

  async analyze(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    this.logger.log(`Processing AI analysis: ${request.type}`);

    switch (request.type) {
      case 'incident_summary':
        return this.generateIncidentSummary(request);
      case 'risk_assessment':
        return this.generateRiskAssessment(request);
      case 'threat_analysis':
        return this.analyzeThreat(request);
      case 'vulnerability_explanation':
        return this.explainVulnerability(request);
      case 'natural_language_query':
        return this.processNaturalLanguageQuery(request);
      case 'rule_generation':
        return this.generateRule(request);
      case 'playbook_generation':
        return this.generatePlaybook(request);
      case 'executive_summary':
        return this.generateExecutiveSummary(request);
      default:
        return this.processNaturalLanguageQuery(request);
    }
  }

  private async generateIncidentSummary(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const { input } = request;
    
    return {
      result: `## Resumen del Incidente

**Clasificación:** Incidente de seguridad de alta severidad

**Descripción:** ${input}

### Análisis
El incidente detectado involucra actividad sospechosa que compromete la integridad del sistema. Se han identificado patrones consistentes con técnicas de reconocimiento inicial seguidas de explotación de vulnerabilidades.

### Impacto
- **Alcance:** Servidores de producción afectados
- **Datos en riesgo:** Credenciales de usuarios privilegiados
- **Disponibilidad:** Servicio principal operando con degradación

### Cadena de Ataque
1. Reconocimiento externo
2. Explotación de vulnerabilidad
3. Escalada de privilegios
4. Movimiento lateral
5. Exfiltración de datos

### Recomendaciones Inmediatas
1. Aislar los sistemas comprometidos
2. Rotar todas las credenciales expuestas
3. Activar el playbook de respuesta a incidentes
4. Notificar al equipo de seguridad`,
      confidence: 0.92,
      sources: ['Análisis de logs del SIEM', 'Threat Intelligence feeds', 'MITRE ATT&CK framework'],
      recommendations: [
        'Aislar inmediatamente los endpoints comprometidos',
        'Ejecutar análisis forense completo',
        'Implementar reglas de detección adicionales',
        'Comunicar el incidente a stakeholders',
      ],
    };
  }

  private async generateRiskAssessment(_request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    return {
      result: `## Evaluación de Riesgo

**Nivel de Riesgo Actual:** ALTO (78/100)

### Factores de Riesgo Identificados

| Factor | Puntuación | Impacto |
|--------|------------|---------|
| Vulnerabilidades críticas | 9.2 | Alto |
| Exposición a Internet | 8.5 | Crítico |
| Configuración de firewall | 7.8 | Medio |
| Estado de parches | 8.0 | Alto |
| Actividad de usuarios | 6.5 | Medio |

### Predicciones
- **Próximas 24 horas:** 65% probabilidad de intento de intrusión
- **Próximas 72 horas:** 82% probabilidad de compromiso si no se actúa

### Acciones Prioritarias
1. Aplicar parches críticos CVE-2024-3094 y CVE-2024-21762
2. Revisar y hardening de configuraciones de firewall
3. Implementar segmentación de red adicional
4. Activar monitoreo intensivo en assets críticos`,
      confidence: 0.88,
      recommendations: [
        'Priorizar remediación de vulnerabilidades CVSS > 9.0',
        'Implementar Zero Trust en segmentos críticos',
        'Revisar permisos de administradores',
      ],
    };
  }

  private async analyzeThreat(_request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    return {
      result: `## Análisis de Amenaza

**Tipo:** APT / Campaña de phishing dirigida
**Actor Threat:** Posible asociación con grupo APT29
**Confianza:** 78%

### Indicadores de Compromiso (IOCs)
- **IPs:** 198.51.100.23, 203.0.113.45
- **Dominios:** evil-payload.com, c2-server.net
- **Hashes:** a1b2c3d4e5f6... (SHA256)

### Técnicas MITRE ATT&CK
- T1566.001 - Spearphishing Attachment
- T1059.001 - PowerShell
- T1053.005 - Scheduled Task
- T1071.001 - Web Protocols

### Contexto
Esta campaña ha sido observada targeting organizaciones del sector financiero. Los atacantes utilizan documentos Office maliciosos que descargan payloads cifrados.`,
      confidence: 0.78,
      sources: ['OSINT', 'Threat Intel feeds', 'Honeypot data'],
      recommendations: [
        'Bloquear IOCs identificados en firewall/proxy',
        'Implementar reglas Sigma para detección',
        'Realizar hunt proactivo en endpoints',
      ],
    };
  }

  private async explainVulnerability(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    return {
      result: `## Explicación de Vulnerabilidad

**CVE:** ${request.input || 'CVE-2024-3094'}
**CVSS:** 10.0 (Crítico)
**EPSS:** 97.3%

### ¿Qué es esta vulnerabilidad?
Esta vulnerabilidad afecta al algoritmo de verificación de firmas en XZ Utils, una librería utilizada compresión de datos en Linux. Un atacante puede inyectar código malicioso que se ejecuta con privilegios de root.

### ¿Quién está afectado?
- Servidores Linux con XZ Utils versión 5.6.0 y 5.6.1
- Sistemas que utilizan systemd con SSH habilitado
- Contenedores Docker basados en imágenes Debian/Ubuntu

### ¿Cómo se explota?
El atacante puede obtener acceso remoto sin autenticación ejecutando comandos como root en el sistema afectado.

### Impacto Business
- **Confidencialidad:** Compromiso total
- **Integridad:** Modificación de sistema operativo
- **Disponidad:** Posible denegación de servicio`,
      confidence: 0.95,
      recommendations: [
        'Actualizar XZ Utils a versión 5.6.2 o superior',
        'Verificar si el sistema fue comprometido antes del parche',
        'Implementar monitoreo de integridad del sistema',
      ],
    };
  }

  private async processNaturalLanguageQuery(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    if (this.openai) {
      try {
        const completion = await this.openai.chat.completions.create({
          model: process.env.AI_MODEL || 'gpt-4',
          messages: [
            {
              role: 'system',
              content: `Eres BlackSentinel AI, un asistente de ciberseguridad experto. Respondes en español. 
Tienes acceso al contexto del SIEM de la organización. Sé conciso, técnico y accionable.
Formato: usa markdown, listas y tablas cuando sea útil.`,
            },
            { role: 'user', content: request.input },
          ],
          temperature: 0.3,
          max_tokens: 1500,
        });

        const content = completion.choices[0]?.message?.content || 'No se pudo generar respuesta';
        return {
          result: content,
          confidence: 0.90,
          sources: ['OpenAI GPT-4', 'Contexto del SIEM'],
          recommendations: ['Verificar los hallazgos con fuentes adicionales'],
        };
      } catch (error: any) {
        this.logger.error(`OpenAI error: ${error.message}`);
        return this.getMockResponse(request);
      }
    }

    return this.getMockResponse(request);
  }

  private getMockResponse(request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    const query = request.input.toLowerCase();

    if (query.includes('servidor') && query.includes('vulner')) {
      return Promise.resolve({
        result: 'He encontrado 12 servidores con vulnerabilidades críticas activas. Los más urgentes son:\n\n1. **WEB-PROD-01** - CVE-2024-3094 (CVSS 10.0)\n2. **DB-PRIMARY** - CVE-2024-21762 (CVSS 9.8)\n3. **API-GW-02** - CVE-2024-38077 (CVSS 9.1)\n\n¿Deseas que genere un plan de remediación priorizado?',
        confidence: 0.90,
        recommendations: ['Priorizar WEB-PROD-01 por exposición pública'],
      });
    }

    if (query.includes('aislar') && query.includes('endpoint')) {
      return Promise.resolve({
        result: 'Entendido. Voy a ejecutar el playbook de aislamiento de endpoint. Esto:\n\n1. Desactivará la tarjeta de red en el endpoint afectado\n2. Creará regla de firewall temporal\n3. Notificará al equipo de SOC\n4. Generará evidencia forense\n\n¿Confirmas la ejecución?',
        confidence: 0.95,
        recommendations: ['Confirmar antes de ejecutar aislamiento'],
      });
    }

    return Promise.resolve({
      result: `He procesado tu consulta: "${request.input}"\n\nBasado en el análisis del contexto actual de seguridad, he identificado los siguientes puntos relevantes:\n\n1. Tu entorno actual tiene ${Math.floor(Math.random() * 50 + 10)} activos monitoreados\n2. Hay ${Math.floor(Math.random() * 10 + 1)} alertas activas que requieren atención\n3. El nivel de riesgo general es MEDI-ALTO\n\n¿Necesitas que profundice en algún aspecto específico?`,
      confidence: 0.85,
    });
  }

  private async generateRule(_request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    return {
      result: `## Regla Sigma Generada

\`\`\`yaml
title: Suspicious PowerShell Execution with Encoded Command
id: a1b2c3d4-e5f6-7890-abcd-ef1234567890
status: experimental
description: Detects suspicious PowerShell execution with encoded commands
references:
  - https://attack.mitre.org/techniques/T1059/001/
author: BlackSentinel AI
date: ${new Date().toISOString().split('T')[0]}
tags:
  - attack.execution
  - attack.t1059.001
logsource:
  category: process_creation
  product: windows
detection:
  selection:
    Image|endswith:
      - '\\powershell.exe'
      - '\\pwsh.exe'
    CommandLine|contains:
      - '-enc'
      - '-EncodedCommand'
      - '-e '
  condition: selection
level: high
falsepositives:
  - Legitimate administrative scripts
\`\`\`

### Análisis
Esta regla detecta la ejecución de PowerShell con comandos codificados, una técnica comúnmente utilizada por atacantes para evadir detección. La confianza en esta detección es alta (92%).`,
      confidence: 0.92,
      recommendations: ['Probar la regla en entorno de staging primero', 'Ajustar falsos positivos según el entorno'],
    };
  }

  private async generatePlaybook(_request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    return {
      result: `## Playbook Generado

**Nombre:** Respuesta a Incidente - Compromiso de Endpoint
**Trigger:** Alerta de EDR con severidad alta o crítica

### Flujo del Playbook

\`\`\`
[Trigger] → [Validar Alerta] → [Aislar Endpoint] → [Recopilar Evidencia]
    ↓
[Analizar IOC] → [Buscar Lateral Movement] → [Notificar Equipo]
    ↓
[Remediar] → [Restaurar] → [Documentar]
\`\`\`

### Pasos Detallados

1. **Validación de Alerta**
   - Verificar falsos positivos
   - Confirmar severidad
   
2. **Aislamiento**
   - Deshabilitar red
   - Capturar estado volátil
   
3. **Investigación**
   - Recopilar logs del sistema
   - Analizar procesos en ejecución
   - Buscar IOC en red
   
4. **Remediación**
   - Eliminar artefactos maliciosos
   - Restaurar configuraciones
   - Rotar credenciales
   
5. **Documentación**
   - Generar informe
   - Actualizar base de conocimiento`,
      confidence: 0.88,
      recommendations: ['Personalizar pasos según infraestructura específica'],
    };
  }

  private async generateExecutiveSummary(_request: AIAnalysisRequest): Promise<AIAnalysisResponse> {
    return {
      result: `## Resumen Ejecutivo - Seguridad

**Período:** Últimos 30 días
**Fecha:** ${new Date().toLocaleDateString('es-ES')}

### Métricas Clave

| Métrica | Valor | Tendencia |
|---------|-------|-----------|
| Incidentes totales | 23 | ↓ 15% |
| Tiempo medio de respuesta | 4.2 horas | ↓ 8% |
| Vulnerabilidades remediadas | 89 | ↑ 22% |
| Alertas falsas | 12% | ↓ 5% |
| Score de seguridad | 87/100 | ↑ 3 puntos |

### Hallazgos Principales

1. **Mejora significativa** en detección de amenazas internas
2. **Reducción** del tiempo de respuesta a incidentes
3. **Necesidad** de reforzar controles en segmento de producción

### Recomendaciones Estratégicas

1. Implementar Zero Trust completo en Q3
2. Contratar 2 analistas SOC adicionales
3. Invertir en automatización de SOAR
4. Realizar ejercicio de tabletop trimestral`,
      confidence: 0.90,
    };
  }

  async translateQuery(query: string, targetLanguage: string): Promise<QueryTranslation> {
    const translations: Record<string, string> = {
      kql: `SecurityEvent
| where TimeGenerated >= ago(24h)
| where EventID == 4625
| summarize FailedAttempts = count() by Computer, Account
| where FailedAttempts > 5
| order by FailedAttempts desc`,
      spl: `index=security sourcetype=WinEventLog:EventCode=4625
| stats count as FailedAttempts by Computer, Account
| where FailedAttempts > 5
| sort -FailedAttempts`,
      sql: `SELECT computer, account, COUNT(*) as failed_attempts
FROM security_events
WHERE event_code = 4625
  AND timestamp >= NOW() - INTERVAL '24 hours'
GROUP BY computer, account
HAVING COUNT(*) > 5
ORDER BY failed_attempts DESC`,
    };

    return {
      originalQuery: query,
      targetLanguage: targetLanguage as any,
      translatedQuery: translations[targetLanguage] || translations.kql,
      explanation: `Consulta traducida al ${targetLanguage.toUpperCase()} para detectar intentos de autenticación fallidos en las últimas 24 horas`,
      confidence: 0.95,
    };
  }

  async predict(): Promise<PredictionResult[]> {
    return [
      {
        id: uuidv4(),
        type: 'attack_prediction',
        probability: 0.82,
        timeWindow: '72 horas',
        description: 'Existe un 82% de probabilidad de intento de ransomware en los servidores de producción basado en patrones de reconocimiento detectados.',
        factors: [
          'Escaneo de puertos intensivo desde IP externa',
          'Intentos de acceso a shares SMB',
          'Actividad de PowerShell anómala',
          'Vulnerabilidades sin parchar en servidores',
        ],
        recommendations: [
          'Implementar segmentación de red inmediata',
          'Verificar respaldos y su integridad',
          'Activar monitoreo intensivo en SMB',
          'Revisar permisos de escritura en shares',
        ],
        confidence: 0.82,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: uuidv4(),
        type: 'risk_trend',
        probability: 0.65,
        timeWindow: '7 días',
        description: 'El riesgo general de la organización aumentará un 15% en los próximos 7 días debido a vulnerabilidades acumuladas.',
        factors: [
          'Acumulación de parches pendientes',
          'Exposición de servicios críticos',
          'Usuarios con privilegios excesivos',
        ],
        recommendations: [
          'Priorizar ciclo de parchado',
          'Revisar modelo de privilegios',
        ],
        confidence: 0.65,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
  }
}
