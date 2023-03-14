import * as React from 'react';

import Detail from '../Detail';
import DetailItem from '../DetailItem';

const sizes = {
    sm: 'Small',
    md: 'Middle',
    lg: 'Large',
};

/**
 * Table with different cell's sizes
 * @order 2
 * @col 8
 */
export default () => (
    <>
        {Object.keys(sizes).map(size => (
            <div
                style={{marginBottom: '30px'}}
                key={size}
            >
                <Detail
                    title={sizes[size]}
                    size={size}
                    responsive={false}
                >
                    <DetailItem label="Product">Cloud Database</DetailItem>
                    <DetailItem label="Billing Mode">Prepaid</DetailItem>
                    <DetailItem label="Automatic Renewal">YES</DetailItem>
                    <DetailItem label="Order time">2018-04-24  18:00:00</DetailItem>
                    <DetailItem
                        label="Usage Time"
                        span={2}
                    >
                        2018-04-24  18:00:00
                    </DetailItem>
                    <DetailItem
                        label="Status"
                        span={3}
                    >
                        Running
                    </DetailItem>
                    <DetailItem label="Negotaited Amount">$80.00</DetailItem>
                    <DetailItem label="Discount">$20.00</DetailItem>
                    <DetailItem label="Official Receipts">$60.00</DetailItem>
                    <DetailItem label="Config Info">
                        Data disk type: MongoDB
                        <br />
                        Database version: 3.4
                        <br />
                        Package: dds.mongo.mid
                        <br />
                        Storage space: 10 GB
                        <br />
                        Replication factor: 3
                        <br />
                        Region: East China 1
                        <br />
                    </DetailItem>
                </Detail>
            </div>
        ))}
    </>
);
