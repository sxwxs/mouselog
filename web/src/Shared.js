import React from "react";
import {Button, Col, Popover, Table, Tag, Typography} from "antd";
import {Circle, Layer, Line, Stage} from "react-konva";
import Canvas from "./Canvas";
const {Text} = Typography;

export function getPoints(trace, scale) {
  if (trace === null) {
    return [];
  }

  let points = [];
  trace.events.forEach(function (event) {
    points.push(event.x * scale);
    points.push(event.y * scale);
  });
  return points;
}

export function renderTraceTable(title, traces, self, isLong=false, hasCanvas=false) {
  let columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
      sorter: (a, b) => a.id - b.id,
      ellipsis: true,
    },
    // {
    //   title: 'Width',
    //   dataIndex: 'width',
    //   key: 'width',
    //   sorter: (a, b) => a.width - b.width,
    // },
    // {
    //   title: 'Height',
    //   dataIndex: 'height',
    //   key: 'height',
    //   sorter: (a, b) => a.height - b.height,
    // },
  ];

  if (hasCanvas) {
    columns.push(
        {
          title: 'Url',
          dataIndex: 'url',
          key: 'url',
          sorter: (a, b) => a.url.localeCompare(b.url),
        },
        {
          title: 'UserAgent',
          dataIndex: 'userAgent',
          key: 'userAgent',
          sorter: (a, b) => a.userAgent.localeCompare(b.userAgent),
        },
        {
          title: 'ClientIp',
          dataIndex: 'clientIp',
          key: 'clientIp',
          sorter: (a, b) => a.clientIp.localeCompare(b.clientIp),
        },
    );
  }

  columns.push(
      {
        title: 'Event Count',
        dataIndex: 'events.length',
        key: 'count',
        sorter: (a, b) => a.events.length - b.events.length,
      },
      {
        title: 'PointerType',
        dataIndex: 'pointerType',
        key: 'pointerType',
        sorter: (a, b) => a.pointerType.localeCompare(b.pointerType),
      },
      {
        title: 'Label',
        dataIndex: 'label',
        key: 'label',
        sorter: (a, b) => a.label - b.label,
      },
      {
        title: 'Guess',
        dataIndex: 'guess',
        key: 'guess',
        sorter: (a, b) => a.guess - b.guess,
      },
      {
        title: 'Reason',
        dataIndex: 'reason',
        key: 'reason',
        sorter: (a, b) => a.reason.localeCompare(b.reason),
      }
  );

  if (hasCanvas) {
    const content = (trace) => (
        <div style={{ width: '500px' }}>
          {
            renderEventTable(trace.id, trace.events)
          }
        </div>
    );

    columns.push(
        {
          title: 'Events',
          key: 'events',
          render: (text, trace, index) => {
            return (
                <Popover placement="topRight" content={content(trace)} title="" trigger="click">
                  <Button>View</Button>
                </Popover>
            )
          }
        }
    );

    columns.push(
        {
          title: 'Canvas',
          key: 'canvas',
          width: 800,
          render: (text, record, index) => {
            return <Canvas trace={traces[record.id]} size={getSize(traces[record.id], 4)} isBackground={false} focusIndex={0} />
          }
        }
    );
  }

  let rowRadioSelection = {
    type: 'radio',
    columnTitle: 'Select',
    onSelect: (selectedRowKeys, selectedRows) => {
      console.log(selectedRowKeys, selectedRows);

      self.setState({
        trace: selectedRowKeys,
      });
    },
  };

  if (self === null || hasCanvas) {
    rowRadioSelection = null;
  }

  let scrollY = 'calc(95vh - 450px)';
  if (isLong) {
    scrollY = 'calc(95vh - 150px)';
  }

  // Dynamic height: https://github.com/ant-design/ant-design/issues/14379#issuecomment-458402994
  return (
      <div>
        <Table rowSelection={rowRadioSelection} columns={columns} dataSource={traces} size="small" bordered
               title={() => <div><Text>Traces for: </Text><Tag color="#108ee9">{title}</Tag></div>} pagination={{pageSize: 100}} scroll={{y: scrollY}}
               rowClassName={(record, index) => { return (record.label === 1 || record.guess === 1) ? 'bot-row' : '' }} />
      </div>
  );
}

export function renderEventTable(title, events, isLong=false, rowHoverHandler=null) {
  const columns = [
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
    {
      title: 'Event Type',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: 'Button',
      dataIndex: 'button',
      key: 'button',
    },
    {
      title: 'X',
      dataIndex: 'x',
      key: 'x',
    },
    {
      title: 'Y',
      dataIndex: 'y',
      key: 'y',
    }
  ];

  let handleRow = record => {
    return {
      onMouseEnter: event => {
        // alert(record);
        rowHoverHandler(record.id);
      },
      onMouseLeave: event => {
        rowHoverHandler(-1);
      }
    }
  };
  if (rowHoverHandler === null) {
    handleRow = null;
  }

  if (!isLong) {
    return (
        <div>
          <Table columns={columns} dataSource={events} size="small" bordered pagination={{pageSize: 100}} scroll={{y: 'calc(95vh - 450px)'}}
                 title={() => <div><Text>Events for: </Text><Tag color="#108ee9">{title}</Tag></div>} onRow={handleRow}/>
        </div>
    );
  } else {
    return (
        <div>
          <Table columns={columns} dataSource={events} size="small" bordered
                 title={() => <div><Text>Events for: </Text><Tag color="#108ee9">{title}</Tag></div>} pagination={{pageSize: 100}} scroll={{y: 700}} onRow={handleRow} />
        </div>
    );
  }
}

export function getSizeSmall() {
  const scale = 0.49;
  const width = document.body.scrollWidth * scale;
  const height = document.body.scrollHeight * scale;

  return {scale: scale, width: width, height: height};
}

export function getSize(trace, divider) {
  let width = Math.trunc(document.body.scrollWidth / divider - 20);
  let height = Math.trunc(document.body.scrollHeight / divider - 20);
  let scale = 1;
  if (trace !== null) {
    let h = Math.trunc(width * trace.height / trace.width);
    const hMax = document.body.scrollHeight - 100;
    if (h < hMax) {
      height = h;
    } else {
      height = hMax;
      width = Math.trunc(height * trace.width / trace.height);
    }
    scale = height / trace.height;
  }

  return {scale: scale, width: width, height: height};
}
