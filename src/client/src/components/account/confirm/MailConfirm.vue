<template>
    <div id="confirm-mail" class="p-3">
        <div class="card mt-3">
            <h4>성공적으로 회원가입을 완료했습니다.</h4>
            <p>회원가입한 이메일로 인증메일을 보냈습니다 확인해 주세요!</p>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'ConfirmMail',
        created () {
        },
        data () {
            return {
            }
        },
        methods: {

        }
    }
</script>

<style scoped>

    .card{
        width: 100%;
        max-width: 350px;
        padding: 15px;
        margin: auto;
    }

    #confirm-mail{
        height: 100%;
        background-color: #f5f5f5;
    }

</style>