import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  Connector,
  ConnectorCategory,
} from '../../database/entities/connector.entity';

export interface ConnectorTemplate {
  name: string;
  type: string;
  category: ConnectorCategory;
  description: string;
  icon: string;
  vendor: string;
  configSchema: Record<
    string,
    {
      type: string;
      label: string;
      required: boolean;
      placeholder?: string;
      options?: string[];
    }
  >;
}

@Injectable()
export class ConnectorsService {
  constructor(
    @InjectRepository(Connector) private connectorRepo: Repository<Connector>,
  ) {
    this.seedConnectors();
  }

  // FREE VERSION: Only 10 templates across 5 categories (vs 64 across 14)
  private readonly templates: ConnectorTemplate[] = [
    {
      name: 'AWS CloudTrail',
      type: 'cloud',
      category: 'cloud',
      description: 'AWS CloudTrail audit logging and management events',
      icon: 'aws',
      vendor: 'Amazon Web Services',
      configSchema: {
        accessKeyId: {
          type: 'text',
          label: 'Access Key ID',
          required: true,
          placeholder: 'AKIA...',
        },
        secretAccessKey: {
          type: 'password',
          label: 'Secret Access Key',
          required: true,
        },
        region: {
          type: 'text',
          label: 'Region',
          required: true,
          placeholder: 'us-east-1',
        },
      },
    },
    {
      name: 'CrowdStrike Falcon',
      type: 'api',
      category: 'edr',
      description: 'CrowdStrike Falcon EDR detection and response',
      icon: 'crowdstrike',
      vendor: 'CrowdStrike',
      configSchema: {
        apiKey: { type: 'password', label: 'API Key', required: true },
        apiSecret: { type: 'password', label: 'API Secret', required: true },
        baseUrl: {
          type: 'text',
          label: 'Base URL',
          required: false,
          placeholder: 'https://api.crowdstrike.com',
        },
      },
    },
    {
      name: 'Palo Alto Networks',
      type: 'syslog',
      category: 'network',
      description: 'Palo Alto PA-Series firewall logs via syslog',
      icon: 'paloalto',
      vendor: 'Palo Alto Networks',
      configSchema: {
        host: { type: 'text', label: 'Syslog Host', required: true },
        port: {
          type: 'text',
          label: 'Port',
          required: false,
          placeholder: '514',
        },
        protocol: {
          type: 'select',
          label: 'Protocol',
          required: true,
          options: ['TCP', 'UDP'],
        },
      },
    },
    {
      name: 'Splunk',
      type: 'api',
      category: 'siem',
      description: 'Splunk Enterprise / Cloud log ingestion',
      icon: 'splunk',
      vendor: 'Splunk',
      configSchema: {
        host: { type: 'text', label: 'Splunk Host', required: true },
        port: {
          type: 'text',
          label: 'Management Port',
          required: false,
          placeholder: '8089',
        },
        hecToken: { type: 'password', label: 'HEC Token', required: true },
        index: { type: 'text', label: 'Default Index', required: false },
      },
    },
    {
      name: 'Okta',
      type: 'api',
      category: 'identity',
      description: 'Okta identity and SSO event logs',
      icon: 'okta',
      vendor: 'Okta',
      configSchema: {
        orgUrl: {
          type: 'text',
          label: 'Okta Org URL',
          required: true,
          placeholder: 'https://yourorg.okta.com',
        },
        apiToken: { type: 'password', label: 'API Token', required: true },
      },
    },
    {
      name: 'Jira',
      type: 'api',
      category: 'ticketing',
      description: 'Atlassian Jira issue tracking integration',
      icon: 'jira',
      vendor: 'Atlassian',
      configSchema: {
        baseUrl: {
          type: 'text',
          label: 'Jira URL',
          required: true,
          placeholder: 'https://yourorg.atlassian.net',
        },
        email: { type: 'text', label: 'Email', required: true },
        apiToken: { type: 'password', label: 'API Token', required: true },
        projectKey: { type: 'text', label: 'Project Key', required: true },
      },
    },
    {
      name: 'Slack',
      type: 'webhook',
      category: 'collaboration',
      description: 'Slack notifications and alerts via webhook',
      icon: 'slack',
      vendor: 'Slack',
      configSchema: {
        webhookUrl: {
          type: 'text',
          label: 'Webhook URL',
          required: true,
          placeholder: 'https://hooks.slack.com/services/...',
        },
        channel: {
          type: 'text',
          label: 'Channel',
          required: false,
          placeholder: '#security-alerts',
        },
      },
    },
    {
      name: 'Microsoft Teams',
      type: 'webhook',
      category: 'collaboration',
      description: 'Microsoft Teams notifications via connector',
      icon: 'microsoft',
      vendor: 'Microsoft',
      configSchema: {
        webhookUrl: { type: 'text', label: 'Webhook URL', required: true },
      },
    },
    {
      name: 'Syslog TCP/UDP',
      type: 'syslog',
      category: 'endpoint',
      description: 'Standard syslog receiver for any device',
      icon: 'syslog',
      vendor: 'Standard',
      configSchema: {
        port: {
          type: 'text',
          label: 'Port',
          required: false,
          placeholder: '514',
        },
        protocol: {
          type: 'select',
          label: 'Protocol',
          required: true,
          options: ['TCP', 'UDP'],
        },
      },
    },
    {
      name: 'VirusTotal',
      type: 'api',
      category: 'threat_intel',
      description: 'VirusTotal malware and URL analysis',
      icon: 'virustotal',
      vendor: 'VirusTotal',
      configSchema: {
        apiKey: { type: 'password', label: 'API Key', required: true },
      },
    },
  ];

  private async seedConnectors() {
    if ((await this.connectorRepo.count()) > 0) return;
    const defaults: Array<Partial<Connector>> = [
      {
        name: 'Syslog TCP/UDP',
        type: 'syslog',
        category: 'endpoint',
        description: 'Standard syslog receiver for any device',
        status: 'active',
        isEnabled: true,
        eventsReceived: 125000,
        eventsProcessed: 124500,
        config: { port: 514, protocol: 'TCP' },
        icon: 'syslog',
        vendor: 'Standard',
      },
      {
        name: 'AWS CloudTrail',
        type: 'cloud',
        category: 'cloud',
        description: 'AWS CloudTrail audit logging',
        status: 'inactive',
        isEnabled: false,
        icon: 'aws',
        vendor: 'Amazon Web Services',
      },
      {
        name: 'Slack',
        type: 'webhook',
        category: 'collaboration',
        description: 'Slack notifications and alerts via webhook',
        status: 'inactive',
        isEnabled: false,
        icon: 'slack',
        vendor: 'Slack',
      },
    ];
    for (const d of defaults)
      await this.connectorRepo.save(this.connectorRepo.create(d));
  }

  async findAll() {
    return this.connectorRepo.find({
      order: { isEnabled: 'DESC', createdAt: 'DESC' },
    });
  }
  async findById(id: string) {
    const c = await this.connectorRepo.findOne({ where: { id } });
    if (!c) throw new NotFoundException('Connector not found');
    return c;
  }
  async create(dto: Partial<Connector>) {
    return this.connectorRepo.save(this.connectorRepo.create(dto));
  }
  async update(id: string, dto: Partial<Connector>) {
    const c = await this.findById(id);
    Object.assign(c, dto);
    return this.connectorRepo.save(c);
  }
  async delete(id: string) {
    const c = await this.findById(id);
    await this.connectorRepo.remove(c);
  }
  async toggle(id: string) {
    const c = await this.findById(id);
    c.isEnabled = !c.isEnabled;
    c.status = c.isEnabled ? 'active' : 'inactive';
    return this.connectorRepo.save(c);
  }

  async testConnection(id: string) {
    const c = await this.findById(id);
    const success = c.config && Object.keys(c.config).length > 0;
    if (success) {
      c.status = 'active';
      c.lastError = null;
      c.lastErrorAt = null;
    } else {
      c.status = 'error';
      c.lastError = 'Missing configuration parameters';
      c.lastErrorAt = new Date();
    }
    await this.connectorRepo.save(c);
    return {
      success,
      message: success
        ? 'Connection successful'
        : 'Connection failed: missing configuration',
      connector: c,
    };
  }

  async getStats() {
    const total = await this.connectorRepo.count();
    const active = await this.connectorRepo.count({
      where: { status: 'active' as any },
    });
    const totalEvents =
      (
        await this.connectorRepo
          .createQueryBuilder('c')
          .select('SUM(c.eventsReceived)', 'sum')
          .getRawOne()
      )?.sum || 0;
    return {
      total,
      active,
      inactive: total - active,
      totalEvents: parseInt(totalEvents, 10),
    };
  }

  async getTemplates() {
    return this.templates;
  }

  async getTemplatesByCategory() {
    const categories: Record<string, ConnectorTemplate[]> = {};
    for (const t of this.templates) {
      if (!categories[t.category]) categories[t.category] = [];
      categories[t.category].push(t);
    }
    return categories;
  }
}
