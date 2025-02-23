/*
 * Copyright 2021 Chaos Mesh Authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import * as Yup from 'yup'

import { ExperimentKind } from 'components/NewExperiment/types'

export type Kind = Exclude<ExperimentKind, 'HTTPChaos' | 'JVMChaos' | 'PhysicalMachineChaos'>
export type KindPhysic =
  | Extract<Kind, 'NetworkChaos' | 'StressChaos' | 'TimeChaos'>
  | 'DiskChaos'
  | 'JVMChaos'
  | 'ProcessChaos'
type FieldType = 'text' | 'textarea' | 'number' | 'select' | 'label' | 'autocomplete'
interface SpecField {
  field: FieldType
  items?: any[]
  isKV?: boolean
  label: string
  value: any
  helperText?: string
  inputProps?: Record<string, any>
  if?: { key: string; equal: string | string[] }
}
export type Spec = Record<string, SpecField>
interface Category {
  name: string
  key: string
  spec: Spec
}
export interface Definition {
  categories?: Category[]
  spec?: Spec
}

const awsCommon: Spec = {
  secretName: {
    field: 'text',
    label: 'Secret name',
    value: '',
    helperText: 'Optional. The Kubernetes secret which includes AWS credentials',
  },
  awsRegion: {
    field: 'text',
    label: 'Region',
    value: '',
    helperText: 'The AWS region',
  },
  ec2Instance: {
    field: 'text',
    label: 'EC2 instance',
    value: '',
    helperText: 'The ID of a EC2 instance',
  },
}

const dnsCommon: Spec = {
  patterns: {
    field: 'label',
    label: 'Patterns',
    value: [],
    helperText: 'Specify the DNS patterns. For example, type google.com and then press space to add it.',
  },
  containerNames: {
    field: 'label',
    label: 'Affected container names',
    value: [],
    helperText:
      "Optional. Type string and end with a space to generate the container names. If it's empty, all containers will be injected",
  },
}

const gcpCommon: Spec = {
  secretName: {
    field: 'text',
    label: 'Secret name',
    value: '',
    helperText: 'Optional. The Kubernetes secret which includes GCP credentials',
  },
  project: {
    field: 'text',
    label: 'Project',
    value: '',
    helperText: 'The name of a GCP project',
  },
  zone: {
    field: 'text',
    label: 'Zone',
    value: '',
    helperText: 'The zone of a GCP project',
  },
  instance: {
    field: 'text',
    label: 'Instance',
    value: '',
    helperText: 'The name of a VM instance',
  },
}

const ioCommon: Spec = {
  volumePath: {
    field: 'text',
    label: 'Volume path',
    value: '',
    helperText: 'The mount path of injected volume',
  },
  path: {
    field: 'text',
    label: 'Path',
    value: '',
    helperText: "Optional. The path of files for injecting. If it's empty, the action will inject into all files.",
  },
  containerName: {
    field: 'text',
    label: 'Container name',
    value: '',
    helperText: 'Optional. The target container to inject in',
  },
  percent: {
    field: 'number',
    label: 'Percent',
    value: 100,
    helperText: 'The percentage of injection errors',
  },
  methods: {
    field: 'label',
    label: 'Methods',
    value: [],
    helperText: 'Optional. The IO methods for injecting IOChaos actions',
  },
}

const networkCommon: Spec = {
  direction: {
    field: 'select',
    items: ['from', 'to', 'both'],
    label: 'Direction',
    value: 'to',
    helperText: 'Specify the network direction',
  },
  externalTargets: {
    field: 'label',
    label: 'External targets',
    value: [],
    helperText: 'Type string and end with a space to generate the network targets outside k8s',
  },
  target: undefined as any,
}

const data: Record<Kind, Definition> = {
  // AWS
  AWSChaos: {
    categories: [
      {
        name: 'Stop EC2',
        key: 'ec2-stop',
        spec: {
          action: 'ec2-stop' as any,
          ...awsCommon,
        },
      },
      {
        name: 'Restart EC2',
        key: 'ec2-restart',
        spec: {
          action: 'ec2-restart' as any,
          ...awsCommon,
        },
      },
      {
        name: 'Detach Volumne',
        key: 'detach-volume',
        spec: {
          action: 'detach-volume' as any,
          ...awsCommon,
          deviceName: {
            field: 'text',
            label: 'Device name',
            value: '',
            helperText: 'The device name for the volume',
          },
          volumeID: {
            field: 'text',
            label: 'EBS volume',
            value: '',
            helperText: 'The ID of a EBS volume',
          },
        },
      },
    ],
  },
  // DNS Fault
  DNSChaos: {
    categories: [
      {
        name: 'Error',
        key: 'error',
        spec: {
          action: 'error' as any,
          ...dnsCommon,
        },
      },
      {
        name: 'Random',
        key: 'random',
        spec: {
          action: 'random' as any,
          ...dnsCommon,
        },
      },
    ],
  },
  // GCP
  GCPChaos: {
    categories: [
      {
        name: 'Stop node',
        key: 'node-stop',
        spec: {
          action: 'node-stop' as any,
          ...gcpCommon,
        },
      },
      {
        name: 'Reset node',
        key: 'node-reset',
        spec: {
          action: 'node-reset' as any,
          ...gcpCommon,
        },
      },
      {
        name: 'Loss disk',
        key: 'disk-loss',
        spec: {
          action: 'disk-loss' as any,
          ...gcpCommon,
          deviceNames: {
            field: 'label',
            label: 'Device names',
            value: [],
            helperText: 'Type string and end with a space to generate the device names',
          },
        },
      },
    ],
  },
  // IO Injection
  IOChaos: {
    categories: [
      {
        name: 'Latency',
        key: 'latency',
        spec: {
          action: 'latency' as any,
          delay: {
            field: 'text',
            label: 'Delay',
            value: '',
            helperText:
              "The value of delay of I/O operations. If it's empty, the operator will generate a value for it randomly.",
            inputProps: { min: 0 },
          },
          ...ioCommon,
        },
      },
      {
        name: 'Fault',
        key: 'fault',
        spec: {
          action: 'fault' as any,
          errno: {
            field: 'number',
            label: 'Errno',
            value: 0,
            helperText: 'The error code returned by I/O operators. By default, it returns a random error code',
          },
          ...ioCommon,
        },
      },
      {
        name: 'AttrOverride',
        key: 'attrOverride',
        spec: {
          action: 'attrOverride' as any,
          attr: {
            field: 'label',
            isKV: true,
            label: 'Attr',
            value: [],
          },
          ...ioCommon,
        },
      },
    ],
  },
  // Kernel Fault
  KernelChaos: {
    spec: {
      failKernRequest: {
        callchain: [],
        failtype: 0,
        headers: [],
        probability: 0,
        times: 0,
      },
    } as any,
  },
  // Network Attack
  NetworkChaos: {
    categories: [
      {
        name: 'Partition',
        key: 'partition',
        spec: {
          action: 'partition' as any,
          ...networkCommon,
        },
      },
      {
        name: 'Loss',
        key: 'loss',
        spec: {
          action: 'loss' as any,
          loss: {
            field: 'text',
            label: 'Loss',
            value: '',
            helperText: 'The percentage of packet loss',
          },
          correlation: {
            field: 'text',
            label: 'Correlation',
            value: '',
            helperText: 'The correlation of loss',
          },
          ...networkCommon,
        },
      },
      {
        name: 'Delay',
        key: 'delay',
        spec: {
          action: 'delay' as any,
          latency: {
            field: 'text',
            label: 'Latency',
            value: '',
            helperText: 'The latency of delay',
          },
          jitter: {
            field: 'text',
            label: 'Jitter',
            value: '',
            helperText: 'The jitter of delay',
          },
          correlation: {
            field: 'text',
            label: 'Correlation',
            value: '',
            helperText: 'The correlation of delay',
          },
          ...networkCommon,
        },
      },
      {
        name: 'Duplicate',
        key: 'duplicate',
        spec: {
          action: 'duplicate' as any,
          duplicate: {
            field: 'text',
            label: 'Duplicate',
            value: '',
            helperText: 'The percentage of packet duplication',
          },
          correlation: {
            field: 'text',
            label: 'Correlation',
            value: '',
            helperText: 'The correlation of duplicate',
          },
          ...networkCommon,
        },
      },
      {
        name: 'Corrupt',
        key: 'corrupt',
        spec: {
          action: 'corrupt' as any,
          corrupt: {
            field: 'text',
            label: 'Corrupt',
            value: '',
            helperText: 'The percentage of packet corruption',
          },
          correlation: {
            field: 'text',
            label: 'Correlation',
            value: '',
            helperText: 'The correlation of corrupt',
          },
          ...networkCommon,
        },
      },
      {
        name: 'Bandwidth',
        key: 'bandwidth',
        spec: {
          action: 'bandwidth' as any,
          rate: {
            field: 'text',
            label: 'Rate',
            value: '',
            helperText: 'The rate allows bps, kbps, mbps, gbps, tbps unit. For example, bps means bytes per second',
          },
          limit: {
            field: 'number',
            label: 'Limit',
            value: 0,
            helperText: 'The number of bytes that can be queued waiting for tokens to become available',
          },
          buffer: {
            field: 'number',
            label: 'Buffer',
            value: 0,
            helperText: 'The maximum amount of bytes that tokens can be available instantaneously',
          },
          minburst: {
            field: 'number',
            label: 'Min burst',
            value: 0,
            helperText: 'The size of the peakrate bucket',
          },
          peakrate: {
            field: 'number',
            label: 'Peak rate',
            value: 0,
            helperText: 'The maximum depletion rate of the bucket',
          },
          ...networkCommon,
        },
      },
    ],
  },
  // Pod Fault
  PodChaos: {
    categories: [
      {
        name: 'Pod Failure',
        key: 'pod-failure',
        spec: {
          action: 'pod-failure' as any,
        },
      },
      {
        name: 'Pod Kill',
        key: 'pod-kill',
        spec: {
          action: 'pod-kill' as any,
          gracePeriod: {
            field: 'number',
            label: 'Grace period',
            value: 0,
            helperText: 'Optional. Grace period represents the duration in seconds before the pod should be deleted',
          },
        },
      },
      {
        name: 'Container Kill',
        key: 'container-kill',
        spec: {
          action: 'container-kill' as any,
          containerNames: {
            field: 'label',
            label: 'Container names',
            value: [],
            helperText: 'Type string and end with a space to generate the container names.',
          },
        },
      },
    ],
  },
  // Stress Test
  StressChaos: {
    spec: {
      stressors: {
        cpu: {
          workers: 0,
          load: 0,
          options: [],
        },
        memory: {
          workers: 0,
          size: '',
          options: [],
        },
      },
      stressngStressors: '',
      containerNames: [],
    } as any,
  },
  // Clock Skew
  TimeChaos: {
    spec: {
      timeOffset: {
        field: 'text',
        label: 'Offset',
        value: '',
        helperText: 'Fill the time offset',
      },
      clockIds: {
        field: 'label',
        label: 'Clock ids',
        value: [],
        helperText:
          "Optional. Type string and end with a space to generate the clock ids. If it's empty, it will be set to ['CLOCK_REALTIME']",
      },
      containerNames: {
        field: 'label',
        label: 'Affected container names',
        value: [],
        helperText:
          "Optional. Type string and end with a space to generate the container names. If it's empty, all containers will be injected",
      },
    },
  },
}

const networkPhysicCommon: Spec = {
  correlation: {
    field: 'text',
    label: 'Correlation',
    value: '',
    helperText: 'The correlation of corrupt',
  },
  device: {
    field: 'text',
    label: 'Device',
    value: '',
    helperText: 'Affected device, e.g., eth0',
  },
  hostname: {
    field: 'text',
    label: 'Hostname',
    value: '',
    helperText: 'Specify the hostname',
  },
  'ip-address': {
    field: 'text',
    label: 'IP Address',
    value: '',
    helperText: 'Specify the IP address',
  },
  'ip-protocol': {
    field: 'select',
    items: ['tcp', 'udp', 'icmp', 'all'],
    label: 'IP Protocol',
    value: 'all',
    helperText: 'Specify the IP protocol',
  },
  sourceport: {
    field: 'text',
    label: 'Source Port',
    value: '',
    helperText: 'The source port, split by ,',
    if: {
      key: 'ip-protocol',
      equal: ['tcp', 'udp'],
    },
  },
  'egress-port': {
    field: 'text',
    label: 'Egress Port',
    value: '',
    helperText: 'The egress port, split by ,',
  },
  percent: {
    field: 'text',
    label: 'Percent',
    value: '1',
    helperText: 'Percentage of network packet duplication',
  },
}

const diskPhysicCommon: Spec = {
  size: {
    field: 'text',
    label: 'Size',
    value: '',
    helperText:
      'The supported formats of the size are: c(=1), w(=2), kB(=1000), K(=1024), MB(=1024), M(=1024x1024), GB and so on.',
  },
  path: {
    field: 'text',
    label: 'Path',
    value: '',
    helperText: 'Specify the file path of the data to be read/written',
  },
}

const jvmPhysicClassAndMethod: Spec = {
  class: {
    field: 'text',
    label: 'Class',
    value: '',
    helperText: 'Class that is injected with faults',
  },
  method: {
    field: 'text',
    label: 'Method',
    value: '',
    helperText: 'Method that is injected with faults',
  },
}

const jvmPhysicPidAndPort: Spec = {
  pid: {
    field: 'number',
    label: 'Pid',
    value: '',
    helperText: 'ID of the Java process being injected into the fault',
  },
  port: {
    field: 'number',
    label: 'Port',
    value: 9288,
    helperText: 'The service port of the loaded agent, through which the rules are configured',
  },
}

export const dataPhysic: Record<KindPhysic, Definition> = {
  DiskChaos: {
    categories: [
      {
        name: 'Read Payload',
        key: 'disk-read-payload',
        spec: {
          action: 'disk-read-payload' as any,
          ...diskPhysicCommon,
          payload_process_num: {
            field: 'number',
            label: 'Payload process num',
            value: 1,
          },
        },
      },
      {
        name: 'Write Payload',
        key: 'disk-write-payload',
        spec: {
          action: 'disk-write-payload' as any,
          ...diskPhysicCommon,
          payload_process_num: {
            field: 'number',
            label: 'Payload process num',
            value: 1,
          },
        },
      },
      {
        name: 'Fill',
        key: 'disk-fill',
        spec: {
          action: 'disk-fill' as any,
          ...diskPhysicCommon,
          fill_by_fallocate: {
            field: 'select',
            items: [
              {
                label: 'true',
                value: true,
              },
              {
                label: 'false',
                value: false,
              },
            ],
            label: 'Fill by fallocate',
            value: true,
            helperText: 'Whether to use fallocate to quickly request disk space',
          },
        },
      },
    ],
  },
  JVMChaos: {
    categories: [
      {
        name: 'Exception',
        key: 'jvm-exception',
        spec: {
          action: 'jvm-exception' as any,
          exception: {
            field: 'text',
            label: 'Exception',
            value: '',
            helperText: 'Specify the exception to be thrown',
          },
          ...jvmPhysicClassAndMethod,
          ...jvmPhysicPidAndPort,
        },
      },
      {
        name: 'GC',
        key: 'jvm-gc',
        spec: {
          action: 'jvm-gc' as any,
          ...jvmPhysicPidAndPort,
        },
      },
      {
        name: 'Latency',
        key: 'jvm-latency',
        spec: {
          action: 'jvm-latency' as any,
          latency: {
            field: 'number',
            label: 'Latency',
            value: '',
            helperText: 'Specify the time of latency, unit is millisecond',
          },
          ...jvmPhysicClassAndMethod,
          ...jvmPhysicPidAndPort,
        },
      },
      {
        name: 'Return',
        key: 'jvm-return',
        spec: {
          action: 'jvm-return' as any,
          value: {
            field: 'text',
            label: 'Value',
            value: '',
            helperText: 'Specify the return value',
          },
          ...jvmPhysicClassAndMethod,
          ...jvmPhysicPidAndPort,
        },
      },
      {
        name: 'Stress',
        key: 'jvm-stress',
        spec: {
          action: 'jvm-stress' as any,
          'cpu-count': {
            field: 'number',
            label: 'CPU Count',
            value: '',
            helperText: 'Specify the CPU count',
          },
          'mem-type': {
            field: 'select',
            items: ['stack', 'heap'],
            label: 'Mem Type',
            value: '',
            helperText: 'Specify the mem type',
          },
          ...jvmPhysicPidAndPort,
        },
      },
      {
        name: 'Rule',
        key: 'jvm-rule-data',
        spec: {
          'rule-data': {
            field: 'textarea',
            label: 'Rule',
            value: '',
            helperText: 'byteman rule configuration',
          },
          ...jvmPhysicPidAndPort,
        },
      },
    ],
  },
  NetworkChaos: {
    categories: [
      {
        name: 'Corrupt',
        key: 'network-corrupt',
        spec: {
          action: 'network-corrupt' as any,
          ...networkPhysicCommon,
        },
      },
      {
        name: 'Duplicate',
        key: 'network-duplicate',
        spec: {
          action: 'network-duplicate' as any,
          ...networkPhysicCommon,
        },
      },
      {
        name: 'Loss',
        key: 'network-loss',
        spec: {
          action: 'network-loss' as any,
          ...networkPhysicCommon,
        },
      },
      {
        name: 'Delay',
        key: 'network-delay',
        spec: {
          action: 'network-delay' as any,
          latency: {
            field: 'text',
            label: 'Latency',
            value: '',
            helperText: 'The latency of delay',
          },
          jitter: {
            field: 'text',
            label: 'Jitter',
            value: '',
            helperText: 'The jitter of delay',
          },
          ...networkPhysicCommon,
          percent: undefined as any,
        },
      },
      {
        name: 'Partition',
        key: 'network-partition',
        spec: {
          action: 'network-partition' as any,
          direction: networkCommon['direction'],
          ...networkPhysicCommon,
          'accept-tcp-flags': {
            field: 'text',
            label: 'Accept TCP Flags',
            value: '',
            if: {
              key: 'ip-protocol',
              equal: 'tcp',
            },
          },
          correlation: undefined as any,
          sourceport: undefined as any,
          'egress-port': undefined as any,
          percent: undefined as any,
        },
      },
      {
        name: 'DNS',
        key: 'network-dns',
        spec: {
          action: 'network-dns' as any,
          'dns-hostname': {
            field: 'text',
            label: 'Hostname',
            value: '',
            helperText: 'Affected domains',
          },
          'dns-ip': {
            field: 'text',
            label: 'IP',
            value: '',
            helperText: 'Indicates that the affected domain is mapped to this address',
          },
          'dns-server': {
            field: 'text',
            label: 'Server',
            value: '',
            helperText: 'DNS server address',
          },
        },
      },
    ],
  },
  ProcessChaos: {
    spec: {
      action: 'process' as any,
      process: {
        field: 'text',
        label: 'Process',
        value: '',
        helperText: 'The name or ID of the process to be killed',
      },
      signal: {
        field: 'number',
        label: 'Signal',
        value: 9,
        helperText: 'The process signal value',
      },
    },
  },
  StressChaos: {
    categories: [
      {
        name: 'CPU',
        key: 'stress-cpu',
        spec: {
          action: 'stress-cpu' as any,
          workers: {
            field: 'number',
            label: 'Workers',
            value: 0,
            helperText: 'Workers',
          },
          load: {
            field: 'number',
            label: 'Load',
            value: 0,
            helperText: 'Load',
          },
        },
      },
      {
        name: 'Memory',
        key: 'stress-mem',
        spec: {
          action: 'stress-mem' as any,
          size: {
            field: 'text',
            label: 'Size',
            value: '',
            helperText: 'The supported formats of the size are: B, KB/KiB, MB/MiB, GB/GiB, TB/TiB.',
          },
        },
      },
    ],
  },
  TimeChaos: {
    spec: {
      action: 'clock' as any,
      'time-offset': {
        field: 'text',
        label: 'Offset',
        value: '',
        helperText: 'Fill the time offset',
      },
      pid: {
        field: 'number',
        label: 'Pid',
        value: '',
        helperText: 'ID of the process that will be injected into the fault',
      },
    },
  },
}

const AWSChaosCommonSchema = Yup.object({
  awsRegion: Yup.string().required('The region is required'),
  ec2Instance: Yup.string().required('The ID of the EC2 instance is required'),
})

const patternsSchema = Yup.array().of(Yup.string()).required('The patterns is required')

const GCPChaosCommonSchema = Yup.object({
  project: Yup.string().required('The project is required'),
  zone: Yup.string().required('The zone is required'),
  instance: Yup.string().required('The instance is required'),
})

const networkTargetSchema = Yup.object({
  namespaces: Yup.array().min(1, 'The namespace selectors is required'),
})

export const schema: Partial<Record<Kind, Record<string, Yup.ObjectSchema>>> = {
  AWSChaos: {
    'ec2-stop': AWSChaosCommonSchema,
    'ec2-restart': AWSChaosCommonSchema,
    'detach-volume': AWSChaosCommonSchema.shape({
      deviceName: Yup.string().required('The device name is required'),
      volumeID: Yup.string().required('The ID of the EBS volume is required'),
    }),
  },
  DNSChaos: {
    error: Yup.object({
      patterns: patternsSchema,
    }),
    random: Yup.object({
      patterns: patternsSchema,
    }),
  },
  GCPChaos: {
    'node-stop': GCPChaosCommonSchema,
    'node-reset': GCPChaosCommonSchema,
    'disk-loss': GCPChaosCommonSchema.shape({
      deviceNames: Yup.array().of(Yup.string()).required('At least one device name is required'),
    }),
  },
  IOChaos: {
    latency: Yup.object({
      delay: Yup.string().required('The delay is required'),
    }),
    fault: Yup.object({
      errno: Yup.number().min(0).required('The errno is required'),
    }),
    attrOverride: Yup.object({
      attr: Yup.array().of(Yup.string()).required('The attr is required'),
    }),
  },
  NetworkChaos: {
    partition: Yup.object({
      target: networkTargetSchema,
    }),
    loss: Yup.object({
      loss: Yup.object({
        loss: Yup.string().required('The loss is required'),
      }),
      target: networkTargetSchema,
    }),
    delay: Yup.object({
      delay: Yup.object({
        latency: Yup.string().required('The latency is required'),
      }),
      target: networkTargetSchema,
    }),
    duplicate: Yup.object({
      duplicate: Yup.object({
        duplicate: Yup.string().required('The duplicate is required'),
      }),
      target: networkTargetSchema,
    }),
    corrupt: Yup.object({
      corrupt: Yup.object({
        corrupt: Yup.string().required('The corrupt is required'),
      }),
      target: networkTargetSchema,
    }),
    bandwidth: Yup.object({
      bandwidth: Yup.object({
        rate: Yup.string().required('The rate of bandwidth is required'),
      }),
      target: networkTargetSchema,
    }),
  },
  PodChaos: {
    'pod-kill': Yup.object({
      gracePeriod: Yup.number().min(0, 'Grace period must be non-negative integer'),
    }),
    'container-kill': Yup.object({
      containerNames: Yup.array().of(Yup.string()).required('At least one container name is required'),
    }),
  },
  TimeChaos: {
    default: Yup.object({
      timeOffset: Yup.string().required('The time offset is required'),
    }),
  },
}

export type dataType = typeof data

export default data
