import React from 'react';
import { fireEvent, render } from '../../../tests/utils';
import ThoughtChain from '../index';

import { CheckCircleOutlined } from '@ant-design/icons';
import mountTest from '../../../tests/shared/mountTest';
import rtlTest from '../../../tests/shared/rtlTest';
import themeTest from '../../../tests/shared/themeTest';

import type { ThoughtChainItem } from '../index';

const customizationProps = (key: string): ThoughtChainItem => ({
  title: 'Thought Chain Item Title',
  description: 'description',
  icon: <CheckCircleOutlined />,
  extra: 'Extra',
  footer: 'Thought Chain Item Footer',
  content: `content ${key}`,
});

const items: ThoughtChainItem[] = [
  {
    ...customizationProps('test1'),
    status: 'success',
    key: 'test1',
  },
  {
    ...customizationProps('test2'),
    status: 'error',
    key: 'test2',
  },
  {
    ...customizationProps('test3'),
    status: 'pending',
    key: 'test3',
  },
];

describe('ThoughtChain Component', () => {
  mountTest(() => <ThoughtChain />);

  rtlTest(() => <ThoughtChain items={items} collapsible />);

  themeTest(() => <ThoughtChain items={items} collapsible />);

  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('ThoughtChain component work', () => {
    const { container } = render(<ThoughtChain items={items} collapsible />);
    const element = container.querySelector<HTMLUListElement>('.ant-thought-chain');
    expect(element).toBeTruthy();
    expect(element).toMatchSnapshot();
  });

  it('ThoughtChain component work with collapsible', () => {
    const onExpand = jest.fn();
    const App = () => {
      const [expandedKeys, setExpandedKeys] = React.useState<string[]>([]);
      return (
        <ThoughtChain
          items={items}
          collapsible={{
            expandedKeys,
            onExpand: (keys) => {
              onExpand(keys);
              setExpandedKeys(keys);
            },
          }}
        />
      );
    };
    const { container } = render(<App />);
    const element = container.querySelectorAll<HTMLDivElement>(
      '.ant-thought-chain-item-header-box',
    )[0];
    fireEvent.click(element as Element);
    expect(onExpand).toHaveBeenCalledWith(['test1']);
    fireEvent.click(element as Element);
    expect(onExpand).toHaveBeenCalledWith([]);
  });

  it('ThoughtChain component work with controlled mode', async () => {
    const App = () => {
      const [expandedKeys] = React.useState<string[]>(['test2']);
      return (
        <ThoughtChain
          items={items}
          collapsible={{
            expandedKeys,
          }}
        />
      );
    };
    const { container } = render(<App />);

    const expandBodyElements = container.querySelectorAll<HTMLDivElement>(
      '.ant-thought-chain-item-content-box',
    );
    expect(expandBodyElements).toHaveLength(1);
  });
});
