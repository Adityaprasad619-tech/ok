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

import { update, fetch } from '../../stores/coupons/couponsSlice'
import { useAppDispatch, useAppSelector } from '../../stores/hooks'
import { useRouter } from 'next/router'

const EditCoupons = () => {
  const router = useRouter()
  const dispatch = useAppDispatch()
  const initVals = {

    'title': '',

    'price': '',

    expiry_date: new Date(),

    seller: null,

  }
  const [initialValues, setInitialValues] = useState(initVals)

  const { coupons } = useAppSelector((state) => state.coupons)

  const { couponsId } = router.query

  useEffect(() => {
    dispatch(fetch({ id: couponsId }))
  }, [couponsId])

  useEffect(() => {
    if (typeof coupons === 'object') {
      setInitialValues(coupons)
    }
  }, [coupons])

  useEffect(() => {
      if (typeof coupons === 'object') {

          const newInitialVal = {...initVals};

          Object.keys(initVals).forEach(el => newInitialVal[el] = (coupons)[el])

          setInitialValues(newInitialVal);
      }
  }, [coupons])

  const handleSubmit = async (data) => {
    await dispatch(update({ id: couponsId, data }))
    await router.push('/coupons/coupons-list')
  }

  return (
    <>
      <Head>
        <title>{getPageTitle('Edit coupons')}</title>
      </Head>
      <SectionMain>
        <SectionTitleLineWithButton icon={mdiChartTimelineVariant} title={'Edit coupons'} main>
        {''}
        </SectionTitleLineWithButton>
        <CardBox>
          <Formik
            enableReinitialize
            initialValues={initialValues}
            onSubmit={(values) => handleSubmit(values)}
          >
            <Form>

    <FormField
        label="CouponTitle"
    >
        <Field
            name="title"
            placeholder="CouponTitle"
        />
    </FormField>

    <FormField
        label="PriceinSHM"
    >
        <Field
            type="number"
            name="price"
            placeholder="PriceinSHM"
        />
    </FormField>

      <FormField
          label="ExpiryDate"
      >
          <DatePicker
              dateFormat="yyyy-MM-dd hh:mm"
              showTimeSelect
              selected={initialValues.expiry_date ?
                  new Date(
                      dayjs(initialValues.expiry_date).format('YYYY-MM-DD hh:mm'),
                  ) : null
              }
              onChange={(date) => setInitialValues({...initialValues, 'expiry_date': date})}
          />
      </FormField>

    <FormField label='Seller' labelFor='seller'>
        <Field
            name='seller'
            id='seller'
            component={SelectField}
            options={initialValues.seller}
            itemRef={'users'}

            showField={'firstName'}

        ></Field>
    </FormField>

              <BaseDivider />
              <BaseButtons>
                <BaseButton type="submit" color="info" label="Submit" />
                <BaseButton type="reset" color="info" outline label="Reset" />
                <BaseButton type='reset' color='danger' outline label='Cancel' onClick={() => router.push('/coupons/coupons-list')}/>
              </BaseButtons>
            </Form>
          </Formik>
        </CardBox>
      </SectionMain>
    </>
  )
}

EditCoupons.getLayout = function getLayout(page: ReactElement) {
  return (
      <LayoutAuthenticated>
          {page}
      </LayoutAuthenticated>
  )
}

export default EditCoupons
