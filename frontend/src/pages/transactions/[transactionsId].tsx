import { mdiChartTimelineVariant, mdiUpload } from '@mdi/js'
import Head from 'next/head'
import React, { ReactElement, useEffect, useState } from 'react'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import dayjs from "dayjs";

import CardBox from '../../components/CardBox'
import LayoutAuthenticated from '../../layouts/Authenticated'
import SectionMain from '../../components/SectionMain'
import SectionTitleLineWithButton from '../../components/SectionTitleLineWithButton'
import { getPageTitle } from '../../config'

import { Field, Form, Formik } from 'formik'
import FormField from '../../components/FormField'
import BaseDivider from '../../components/BaseDivider'
import BaseButtons from '../../components/BaseButtons'
import BaseButton from '../../components/BaseButton'
import FormCheckRadio from '../../components/FormCheckRadio'
import FormCheckRadioGroup from '../../components/FormCheckRadioGroup'
import { SelectField } from "../../components/SelectField";
import { SelectFieldMany } from "../../components/SelectFieldMany";
import { SwitchField } from '../../components/SwitchField'
import {RichTextField} from "../../components/RichTextField";

import { update, fetch } from '../../stores/transactions/transactionsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditTransactions = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    user: null,

    'amount': '',

    transaction_type: '',

    transaction_date: new Date(),

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { transactions } = useAppSelector((state) => state.transactions)

  const { transactionsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: transactionsId }))
  }, [transactionsId])

  useEffect(() => {
    if (typeof transactions === 'object') {
      setInitialValues(transactions)
    }
  }, [transactions])

  useEffect(() => {
      if (typeof transactions === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (transactions)[el])

          setInitialValues(newInitialVal);
      }
  }, [transactions])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: transactionsId, data }))
    await router.push('/transactions/transactions-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit transactions')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit transactions'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField label='User' labelFor='user'>
        <Field
            name='user'
            id='user'
            component={SelectField}
            options={initialValues.user}
            itemRef={'users'}

            showField={'firstName'}

        ></Field>
    </FormField>

    <FormField
        label="AmountinSHM"
    >
        <Field
            type="number"
            name="amount"
            placeholder="AmountinSHM"
        />
    </FormField>

    <FormField label="TransactionType" labelFor="transaction_type">
        <Field name="transaction_type" id="transaction_type" component="select">

            <option value="Send">Send</option>

            <option value="Receive">Receive</option>

            <option value="Tip">Tip</option>

            <option value="Subscription">Subscription</option>

            <option value="Crowdfunding">Crowdfunding</option>

            <option value="Rent">Rent</option>

            <option value="CouponPurchase">CouponPurchase</option>

        </Field>
    </FormField>

      <FormField
          label="TransactionDate"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.transaction_date ?
                  new Date(
                      dayjs(initialValues.transaction_date).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'transaction_date': date})}
          />
      </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/transactions/transactions-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditTransactions.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditTransactions
