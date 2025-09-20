import React, { ReactElement, useEffect } from 'react';
import Head from 'next/head'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../stores/hooks";
import {useRouter} from "next/router";
import { fetch } from '../../stores/users/usersSlice'
import dataFormatter from '../../helpers/dataFormatter';
import LayoutAuthenticated from "../../layouts/Authenticated";
import {getPageTitle} from "../../config";
import SectionTitleLineWithButton from "../../components/SectionTitleLineWithButton";
import SectionMain from "../../components/SectionMain";
import CardBox from "../../components/CardBox";
import BaseButton from "../../components/BaseButton";
import BaseDivider from "../../components/BaseDivider";
import {mdiChartTimelineVariant} from "@mdi/js";
import {SwitchField} from "../../components/SwitchField";
import FormField from "../../components/FormField";

const UsersView = () => {
    const router = useRouter()
    const dispatch = useAppDispatch()
    const { users } = useAppSelector((state) => state.users)

    const { id } = router.query;

    function removeLastCharacter(str) {
      console.log(str,`str`)
      return str.slice(0, -1);
    }

    useEffect(() => {
        dispatch(fetch({ id }));
    }, [dispatch, id]);

    return (
      <>
          <Head>
              <title>{getPageTitle('View users')}</title>
          </Head>
          <SectionMain>
            <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={removeLastCharacter('View users')} main>
                <BaseButton
                  color='info'
                  label='Edit'
                  href={`/users/users-edit/?id=${id}`}
                />
            </SectionTitleLineWithButton>
            <CardBox>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>First Name</p>
                    <p>{users?.firstName}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Last Name</p>
                    <p>{users?.lastName}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>Phone Number</p>
                    <p>{users?.phoneNumber}</p>
                </div>

                <div className={'mb-4'}>
                    <p className={'block font-bold mb-2'}>E-Mail</p>
                    <p>{users?.email}</p>
                </div>

                <FormField label='Disabled'>
                    <SwitchField
                      field={{name: 'disabled', value: users?.disabled}}
                      form={{setFieldValue: () => null}}
                      disabled
                    />
                </FormField>

                <>
                    <p className={'block font-bold mb-2'}>Coupons Seller</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>CouponTitle</th>

                                <th>PriceinSHM</th>

                                <th>ExpiryDate</th>

                            </tr>
                            </thead>
                            <tbody>
                            {users.coupons_seller && Array.isArray(users.coupons_seller) &&
                              users.coupons_seller.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/coupons/coupons-view/?id=${item.id}`)}>

                                    <td data-label="title">
                                        { item.title }
                                    </td>

                                    <td data-label="price">
                                        { item.price }
                                    </td>

                                    <td data-label="expiry_date">
                                        { dataFormatter.dateTimeFormatter(item.expiry_date) }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!users?.coupons_seller?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Creators User</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>TotalTippedAmount</th>

                            </tr>
                            </thead>
                            <tbody>
                            {users.creators_user && Array.isArray(users.creators_user) &&
                              users.creators_user.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/creators/creators-view/?id=${item.id}`)}>

                                    <td data-label="total_tipped">
                                        { item.total_tipped }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!users?.creators_user?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Subscriptions User</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>AmountinSHM</th>

                                <th>Frequency</th>

                                <th>NextPaymentDate</th>

                            </tr>
                            </thead>
                            <tbody>
                            {users.subscriptions_user && Array.isArray(users.subscriptions_user) &&
                              users.subscriptions_user.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/subscriptions/subscriptions-view/?id=${item.id}`)}>

                                    <td data-label="amount">
                                        { item.amount }
                                    </td>

                                    <td data-label="frequency">
                                        { item.frequency }
                                    </td>

                                    <td data-label="next_payment_date">
                                        { dataFormatter.dateTimeFormatter(item.next_payment_date) }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!users?.subscriptions_user?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <>
                    <p className={'block font-bold mb-2'}>Transactions User</p>
                    <CardBox
                      className='mb-6 border border-gray-300 rounded overflow-hidden'
                      hasTable
                    >
                        <div className='overflow-x-auto'>
                            <table>
                            <thead>
                            <tr>

                                <th>AmountinSHM</th>

                                <th>TransactionType</th>

                                <th>TransactionDate</th>

                            </tr>
                            </thead>
                            <tbody>
                            {users.transactions_user && Array.isArray(users.transactions_user) &&
                              users.transactions_user.map((item: any) => (
                                <tr key={item.id} onClick={() => router.push(`/transactions/transactions-view/?id=${item.id}`)}>

                                    <td data-label="amount">
                                        { item.amount }
                                    </td>

                                    <td data-label="transaction_type">
                                        { item.transaction_type }
                                    </td>

                                    <td data-label="transaction_date">
                                        { dataFormatter.dateTimeFormatter(item.transaction_date) }
                                    </td>

                                </tr>
                              ))}
                            </tbody>
                        </table>
                        </div>
                        {!users?.transactions_user?.length && <div className={'text-center py-4'}>No data</div>}
                    </CardBox>
                </>

                <BaseDivider />

                <BaseButton
                    color='info'
                    label='Back'
                    onClick={() => router.push('/users/users-list')}
                />
              </CardBox>
          </SectionMain>
      </>
    );
};

UsersView.getLayout = function getLayout(page: ReactElement) {
    return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
    )
}

export default UsersView;
