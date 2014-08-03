{% if package %}
    <header {{ cssClass('!page-header') }}>
        <h {{ cssClass('page-title') }}>{{ package.name }} {{ package.version }}</h>
    </header>
{% endif %}
