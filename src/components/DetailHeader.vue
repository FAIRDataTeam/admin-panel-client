<template>
    <div class="header">
        <div class="container d-flex justify-content-between align-items-center">
            <strong>{{ title }}</strong>
            <div class="actions">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'detail-header',
    props: ['title']
}
</script>

<style scoped>
.header {
    position: fixed;
    left: 0;
    top: 56px;
    right: 0;
    padding: 0.5rem 0;
    background: white;
    border-bottom: 1px solid #ddd;
    z-index: 5;
}

.header .btn-group {
    padding: 0 !important;
}

.actions {
    text-align: right;
}

.actions .btn {
    padding: .375rem 1rem;
    margin-left: 1rem;
}

.actions .btn-group {
    margin-left: 1rem;
}
</style>