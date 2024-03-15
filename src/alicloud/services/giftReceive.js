import mpserverless from "~/alicloud";
import { storeToRefs } from 'pinia'
import { useUserStore } from '~/stores/user'
const { userDataScope, userInfo } = storeToRefs(useUserStore())
const db = mpserverless.db;

/**
 * 计算收礼金额总计
 *
 * @author chadwuo
 */
export const computedTotalGiftReceive = async () => {
    const res = await db.collection('gift_receive').aggregate([
        {
            $match: {
                userId: {
                    $in: userDataScope.value,
                },
            },
        },
        {
            $group: {
                _id: null,
                total: {
                    $sum: '$money',
                },
            },
        },
    ]);
    if (res.success) {
        res.data = result[0].total.toFixed(2)
    }
    return res
};
/**
 * 根据礼簿分页获取收礼数据
 *
 * @author chadwuo
 */
export const getGiftReceivePage = async (parameter) => {
    const { pageSize, pageNo } = parameter
    return await db.collection('gift_receive').aggregate([
        {
            $match: {
                userId: {
                    $in: userDataScope.value,
                },
                bookId: parameter.bookId,
            },
        },
        {
            $sort: {
                money: -1,
                _id: 1,
            },
        },
        {
            $skip: (pageNo - 1) * pageSize,
        },
        {
            $limit: pageSize,
        },
        {
            $lookup: {
                // 左连接
                from: 'friend', // 关联到de表
                localField: 'friendId', // 左表关联的字段
                foreignField: '_id', // 右表关联的字段
                as: 'friendInfo',
            },
        },
        {
            $unwind: {
                // 拆分子数组
                path: '$friendInfo',
                preserveNullAndEmptyArrays: true, // 空的数组也拆分
            },
        },
    ]);
};

/**
 * 添加收礼
 *
 * @author chadwuo
 */
export const addGiftReceive = async (parameter) => {
    const { friendId, friendName, bookId, attendance, money, remarks } = parameter
    // 参数中没有亲友id
    if (!friendId) {
        // 根据亲友名查询库中是否存在
        const { result: friend } = await db.collection('friend').findOne({
            userId: {
                $in: userDataScope.value,
            },
            name: friendName.trim(),
        });

        if (friend && friend._id) {
            // 存在
            friendId = friend._id;
        } else {
            // 添加
            const { result: newFriend } = await db.collection('friend').insertOne({
                userId: userInfo.value._id,
                name: friendName,
                firstLetter: pinyin.getFirstLetter(friendName.substr(0, 1)),
            });
            // 新添加的亲友id
            friendId = newFriend.insertedId;
        }
    }

    return await db.collection('gift_receive').insertOne({
        userId: userInfo.value._id,
        friendId,
        bookId,
        money: Number(money),
        attendance: Number(attendance),
        remarks,
    });
};

/**
 * 更新收礼
 *
 * @author chadwuo
 */
export const updateGiftReceive = async (parameter) => {
    const { attendance, money, remarks } = parameter
    return await db.collection('gift_receive').updateOne(
        {
            _id: parameter._id,
        },
        {
            $set: {
                money: Number(money),
                attendance: Number(attendance),
                remarks,
            },
        }
    );
};

/**
 * 删除收礼
 *
 * @author chadwuo
 */
export const deleteGiftReceive = async (parameter) => {
    return await db.collection('gift_receive').deleteOne({
        _id: parameter._id,
    });
};

/**
 * 详情
 *
 * @author chadwuo
 */
export const getGiftOut = async (parameter) => {
    return await db.collection("gift_receive").findOne({
        _id: parameter._id,
    });
};