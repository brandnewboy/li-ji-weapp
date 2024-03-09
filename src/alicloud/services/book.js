import mpserverless from "~/alicloud/index";
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
const { userDataScope } = storeToRefs(useUserStore())
const db = mpserverless.db;

/**
 * 获取分页
 *
 * @author chadwuo
 */
export const getBookPage = async (parameter) => {
    const { pageSize, pageNo } = parameter
    return await db.collection('book').aggregate([
        {
            $match: {
                userId: {
                    $in: userDataScope.value,
                },
            },
        },
        {
            $sort: {
                date: -1,
            },
        },
        {
            $skip: (pageNo - 1) * pageSize,
        },
        {
            $limit: pageSize,
        },
        {
            // TODO 需要修改
            $lookup: {
                // 左连接
                from: 'gift_receive', // 关联到de表
                localField: '_id', // 左表关联的字段
                foreignField: 'bookId', // 右表关联的字段
                as: 'giftList',
            },
        },
    ]);
}

/**
 * 获取礼簿
 *
 * @author chadwuo
 */
export const getBookInfo = async (parameter) => {
    return await db.collection('book').findOne({
        _id: parameter._id,
    });
}

/**
 * 添加礼簿
 *
 * @author chadwuo
 */
export const addBook = async (parameter) => {
    return await db.collection('book').insertOne({
        userId: userInfo.value._id,
        date: parameter.date,
        title: parameter.title,
        remarks: parameter.remarks,
    });
}


/**
 * 更新礼簿
 *
 * @author chadwuo
 */
export const updateBook = async (parameter) => {
    return await db.collection('book').updateOne(
        {
            _id: parameter._id,
        },
        {
            $set: {
                title: parameter.title,
                date: parameter.date,
                remarks: parameter.remarks,
            },
        }
    );
};

/**
 * 删除礼簿
 *
 * @author chadwuo
 */
export const deleteBook = async (parameter) => {
    let res = await db.collection('book').deleteOne({
        _id: parameter._id,
    });
    if (res.success) {
        // 删除礼簿下所有收礼记录
        res = await db.collection('gift_receive').deleteMany({
            bookId: parameter._id,
        });
    }
    return res
};